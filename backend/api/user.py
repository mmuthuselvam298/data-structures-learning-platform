"""
User Progress, Gamification, Challenges, and Lab State Endpoints
"""
import json
from datetime import datetime, timezone
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException

from backend.models.user import (
    UserResponse,
    ProgressResponse,
    LessonCompleteRequest,
    QuizAttemptRequest,
    ChallengeAttemptRequest,
    VisualLabStateRequest
)
from backend.services.auth_service import get_current_user
from backend.services.database import get_db_connection

router = APIRouter(prefix="/user", tags=["User Progress"])

ACHIEVEMENTS_DEF = [
    {"id": "welcome_explorer", "title": "Welcome Explorer", "description": "Created your DS Playground account.", "icon": "🚀"},
    {"id": "first_lesson", "title": "First Step", "description": "Completed your first interactive lesson.", "icon": "📖"},
    {"id": "first_quiz", "title": "Knowledge Seeker", "description": "Submitted your first concept quiz.", "icon": "🎯"},
    {"id": "first_challenge", "title": "Hands-On Solver", "description": "Completed your first interactive challenge.", "icon": "⚡"},
    {"id": "sorting_explorer", "title": "Sorting Explorer", "description": "Practiced Bubble, Selection, Insertion, or Quick Sort.", "icon": "📊"},
    {"id": "merge_sort_explorer", "title": "Merge Sort Master", "description": "Explored the recursive divide-and-conquer Merge Sort visualizer.", "icon": "🌳"},
    {"id": "stack_master", "title": "Stack Architect", "description": "Mastered LIFO Push, Pop and Infix evaluation.", "icon": "🥞"},
    {"id": "queue_master", "title": "Queue Navigator", "description": "Mastered Circular Queue modulo wrap-around.", "icon": "🔄"},
    {"id": "tree_explorer", "title": "Tree Climber", "description": "Constructed BST and balanced AVL trees.", "icon": "🌲"},
    {"id": "graph_navigator", "title": "Graph Pioneer", "description": "Simulated Dijkstra Drone delivery across SRM-AP.", "icon": "🗺️"},
    {"id": "streak_3", "title": "Consistent Scholar", "description": "Maintained a 3-day learning streak.", "icon": "🔥"},
]

def check_and_award_achievement(cursor, user_id: int, achievement_id: str, now_iso: str):
    cursor.execute("SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?", (user_id, achievement_id))
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
            VALUES (?, ?, ?)
        """, (user_id, achievement_id, now_iso))

@router.get("/progress", response_model=ProgressResponse)
def get_progress(user: dict = Depends(get_current_user)):
    user_id = user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()

    # Completed lessons
    cursor.execute("SELECT lesson_id FROM user_progress WHERE user_id = ?", (user_id,))
    completed_lessons = [row["lesson_id"] for row in cursor.fetchall()]

    # Quiz attempts
    cursor.execute("""
        SELECT quiz_id, score, max_score, created_at 
        FROM quiz_attempts WHERE user_id = ? ORDER BY id DESC LIMIT 50
    """, (user_id,))
    quiz_attempts = [dict(row) for row in cursor.fetchall()]

    # Challenge attempts
    cursor.execute("""
        SELECT id, challenge_id, difficulty, score, max_score, time_seconds, mistakes_json, created_at 
        FROM challenge_attempts WHERE user_id = ? ORDER BY id DESC LIMIT 50
    """, (user_id,))
    challenge_rows = cursor.fetchall()
    challenge_attempts = []
    best_score = 0
    for row in challenge_rows:
        item = dict(row)
        if item.get("mistakes_json"):
            try:
                item["mistakes"] = json.loads(item["mistakes_json"])
            except Exception:
                item["mistakes"] = []
        challenge_attempts.append(item)
        if item["score"] > best_score:
            best_score = item["score"]

    # Achievements
    cursor.execute("SELECT achievement_id FROM user_achievements WHERE user_id = ?", (user_id,))
    unlocked_achievements = [row["achievement_id"] for row in cursor.fetchall()]

    # Calculate quiz average
    quiz_avg = 0.0
    if quiz_attempts:
        percentages = [(q["score"] / max(q["max_score"], 1)) * 100 for q in quiz_attempts]
        quiz_avg = round(sum(percentages) / len(percentages), 1)

    # Current user data
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    fresh_user = dict(cursor.fetchone())
    conn.close()

    user_resp = UserResponse(
        id=fresh_user["id"],
        email=fresh_user["email"],
        full_name=fresh_user["full_name"],
        avatar_url=fresh_user["avatar_url"],
        xp=fresh_user["xp"] or 0,
        streak=fresh_user["streak"] or 1,
        last_active_date=fresh_user["last_active_date"],
        created_at=fresh_user["created_at"]
    )

    return ProgressResponse(
        user=user_resp,
        completed_lessons=completed_lessons,
        quiz_attempts=quiz_attempts,
        challenge_attempts=challenge_attempts,
        achievements=unlocked_achievements,
        quiz_average=quiz_avg,
        challenges_completed=len(challenge_attempts),
        best_challenge_score=best_score
    )

@router.post("/lesson-complete")
def complete_lesson(req: LessonCompleteRequest, user: dict = Depends(get_current_user)):
    user_id = user["id"]
    now_iso = datetime.now(timezone.utc).isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if already completed
    cursor.execute("SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?", (user_id, req.lesson_id))
    existing = cursor.fetchone()
    xp_awarded = 0

    if not existing:
        cursor.execute("""
            INSERT INTO user_progress (user_id, lesson_id, unit_id, completed_at)
            VALUES (?, ?, ?, ?)
        """, (user_id, req.lesson_id, req.unit_id, now_iso))
        xp_awarded = 30
        cursor.execute("UPDATE users SET xp = xp + ? WHERE id = ?", (xp_awarded, user_id))

        # Check achievements
        check_and_award_achievement(cursor, user_id, "first_lesson", now_iso)
        if "sort" in req.lesson_id.lower():
            check_and_award_achievement(cursor, user_id, "sorting_explorer", now_iso)
        if "merge" in req.lesson_id.lower():
            check_and_award_achievement(cursor, user_id, "merge_sort_explorer", now_iso)
        if "stack" in req.lesson_id.lower():
            check_and_award_achievement(cursor, user_id, "stack_master", now_iso)
        if "queue" in req.lesson_id.lower():
            check_and_award_achievement(cursor, user_id, "queue_master", now_iso)
        if "tree" in req.lesson_id.lower():
            check_and_award_achievement(cursor, user_id, "tree_explorer", now_iso)
        if "graph" in req.lesson_id.lower():
            check_and_award_achievement(cursor, user_id, "graph_navigator", now_iso)

    conn.commit()
    cursor.execute("SELECT xp FROM users WHERE id = ?", (user_id,))
    total_xp = cursor.fetchone()["xp"]
    conn.close()

    return {"status": "success", "xp_awarded": xp_awarded, "total_xp": total_xp}

@router.post("/quiz-attempt")
def submit_quiz_attempt(req: QuizAttemptRequest, user: dict = Depends(get_current_user)):
    user_id = user["id"]
    now_iso = datetime.now(timezone.utc).isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO quiz_attempts (user_id, quiz_id, score, max_score, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, req.quiz_id, req.score, req.max_score, now_iso))

    xp_awarded = max(0, req.score * 10)
    cursor.execute("UPDATE users SET xp = xp + ? WHERE id = ?", (xp_awarded, user_id))
    check_and_award_achievement(cursor, user_id, "first_quiz", now_iso)

    conn.commit()
    cursor.execute("SELECT xp FROM users WHERE id = ?", (user_id,))
    total_xp = cursor.fetchone()["xp"]
    conn.close()

    return {"status": "success", "xp_awarded": xp_awarded, "total_xp": total_xp}

@router.post("/challenge-attempt")
def submit_challenge_attempt(req: ChallengeAttemptRequest, user: dict = Depends(get_current_user)):
    user_id = user["id"]
    now_iso = datetime.now(timezone.utc).isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()

    mistakes_json = json.dumps(req.mistakes or [])
    cursor.execute("""
        INSERT INTO challenge_attempts (user_id, challenge_id, difficulty, score, max_score, time_seconds, mistakes_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, req.challenge_id, req.difficulty, req.score, req.max_score, req.time_seconds, mistakes_json, now_iso))

    xp_awarded = max(0, req.score * 15)
    cursor.execute("UPDATE users SET xp = xp + ? WHERE id = ?", (xp_awarded, user_id))
    check_and_award_achievement(cursor, user_id, "first_challenge", now_iso)

    if "merge" in req.challenge_id.lower() or "sort" in req.challenge_id.lower():
        check_and_award_achievement(cursor, user_id, "sorting_explorer", now_iso)
        if "merge" in req.challenge_id.lower():
            check_and_award_achievement(cursor, user_id, "merge_sort_explorer", now_iso)

    conn.commit()
    cursor.execute("SELECT xp FROM users WHERE id = ?", (user_id,))
    total_xp = cursor.fetchone()["xp"]
    conn.close()

    return {"status": "success", "xp_awarded": xp_awarded, "total_xp": total_xp}

@router.get("/achievements")
def list_achievements(user: dict = Depends(get_current_user)):
    user_id = user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?", (user_id,))
    unlocked_map = {row["achievement_id"]: row["unlocked_at"] for row in cursor.fetchall()}
    conn.close()

    results = []
    for ach in ACHIEVEMENTS_DEF:
        results.append({
            **ach,
            "unlocked": ach["id"] in unlocked_map,
            "unlocked_at": unlocked_map.get(ach["id"])
        })
    return results

@router.post("/lab-state")
def save_lab_state(req: VisualLabStateRequest, user: dict = Depends(get_current_user)):
    user_id = user["id"]
    now_iso = datetime.now(timezone.utc).isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO visual_lab_state (user_id, topic, state_json, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id, topic) DO UPDATE SET
            state_json = excluded.state_json,
            updated_at = excluded.updated_at
    """, (user_id, req.topic, json.dumps(req.state_json), now_iso))
    conn.commit()
    conn.close()
    return {"status": "saved", "topic": req.topic}

@router.get("/lab-state/{topic}")
def get_lab_state(topic: str, user: dict = Depends(get_current_user)):
    user_id = user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT state_json FROM visual_lab_state WHERE user_id = ? AND topic = ?", (user_id, topic))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["state_json"])
    return None
