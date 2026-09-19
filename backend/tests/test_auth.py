"""
Backend Authentication and Progress API Tests
"""
import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.database import get_db_connection

client = TestClient(app)

def test_auth_and_progress_lifecycle():
    # 1. Register a test user
    email = "scholar@srmap.edu.in"
    password = "SecurePassword123!"
    full_name = "SRM Scholar"

    # Cleanup if exists
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE email = ?", (email,))
    conn.commit()
    conn.close()

    reg_resp = client.post("/api/auth/register", json={
        "email": email,
        "password": password,
        "full_name": full_name
    })
    assert reg_resp.status_code == 200
    reg_data = reg_resp.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == email
    assert reg_data["user"]["xp"] == 50 # Welcome XP

    token = reg_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Duplicate registration should be rejected
    dup_resp = client.post("/api/auth/register", json={
        "email": email,
        "password": password,
        "full_name": full_name
    })
    assert dup_resp.status_code == 400

    # 3. Login with correct password
    login_resp = client.post("/api/auth/login", json={
        "email": email,
        "password": password
    })
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()

    # 4. Login with invalid password fails
    bad_login = client.post("/api/auth/login", json={
        "email": email,
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 5. Fetch /me profile
    me_resp = client.get("/api/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == email

    # 6. Complete a lesson
    lesson_resp = client.post("/api/user/lesson-complete", json={
        "lesson_id": "unit5-mergesort",
        "unit_id": "unit5"
    }, headers=headers)
    assert lesson_resp.status_code == 200
    assert lesson_resp.json()["xp_awarded"] == 30

    # 7. Record a quiz attempt
    quiz_resp = client.post("/api/user/quiz-attempt", json={
        "quiz_id": "quiz-sorting",
        "score": 4,
        "max_score": 5
    }, headers=headers)
    assert quiz_resp.status_code == 200
    assert quiz_resp.json()["xp_awarded"] == 40

    # 8. Record a challenge attempt
    challenge_resp = client.post("/api/user/challenge-attempt", json={
        "challenge_id": "merge-sort-challenge",
        "difficulty": "medium",
        "score": 9,
        "max_score": 10,
        "time_seconds": 125,
        "mistakes": []
    }, headers=headers)
    assert challenge_resp.status_code == 200
    assert challenge_resp.json()["xp_awarded"] == 135

    # 9. Fetch aggregated progress
    prog_resp = client.get("/api/user/progress", headers=headers)
    assert prog_resp.status_code == 200
    prog_data = prog_resp.json()
    assert "unit5-mergesort" in prog_data["completed_lessons"]
    assert len(prog_data["challenge_attempts"]) == 1
    assert prog_data["user"]["xp"] == 50 + 30 + 40 + 135
    assert "welcome_explorer" in prog_data["achievements"]
    assert "merge_sort_explorer" in prog_data["achievements"]

    # 10. Save and load visual lab state
    save_state = client.post("/api/user/lab-state", json={
        "topic": "sorting",
        "state_json": {"algorithm": "merge", "array": [38, 27, 43, 3]}
    }, headers=headers)
    assert save_state.status_code == 200

    load_state = client.get("/api/user/lab-state/sorting", headers=headers)
    assert load_state.status_code == 200
    assert load_state.json()["algorithm"] == "merge"
