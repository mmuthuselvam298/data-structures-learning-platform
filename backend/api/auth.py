"""
Authentication Endpoints: Register, Login, and Profile Retrieval
"""
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from backend.models.user import UserRegister, UserLogin, UserResponse, TokenResponse
from backend.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_user_by_email,
    get_current_user
)
from backend.services.database import get_db_connection

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register_user(req: UserRegister):
    email = req.email.strip().lower()
    existing = get_user_by_email(email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in."
        )

    hashed = hash_password(req.password)
    now_iso = datetime.now(timezone.utc).isoformat()
    # Default avatar with student initial
    initial = req.full_name.strip()[0].upper() if req.full_name.strip() else "S"
    avatar_url = f"https://api.dicebear.com/7.x/bottts/svg?seed={email}"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO users (email, hashed_password, full_name, avatar_url, xp, streak, last_active_date, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (email, hashed, req.full_name.strip(), avatar_url, 50, 1, now_iso[:10], now_iso))
    user_id = cursor.lastrowid

    # Award "Welcome / First Sign-in" achievement
    cursor.execute("""
        INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
        VALUES (?, ?, ?)
    """, (user_id, "welcome_explorer", now_iso))

    conn.commit()
    conn.close()

    user_data = UserResponse(
        id=user_id,
        email=email,
        full_name=req.full_name.strip(),
        avatar_url=avatar_url,
        xp=50, # 50 welcome XP
        streak=1,
        last_active_date=now_iso[:10],
        created_at=now_iso
    )

    token = create_access_token({"sub": str(user_id), "email": email})
    return TokenResponse(access_token=token, user=user_data)

@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLogin):
    email = req.email.strip().lower()
    user = get_user_by_email(email)
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials."
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    today_str = now_iso[:10]
    
    # Calculate streak
    streak = user["streak"] or 1
    last_active = user["last_active_date"]
    if last_active and last_active != today_str:
        try:
            last_date = datetime.strptime(last_active, "%Y-%m-%d").date()
            today_date = datetime.strptime(today_str, "%Y-%m-%d").date()
            diff_days = (today_date - last_date).days
            if diff_days == 1:
                streak += 1
            elif diff_days > 1:
                streak = 1
        except Exception:
            streak = 1

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users SET streak = ?, last_active_date = ? WHERE id = ?
    """, (streak, today_str, user["id"]))
    conn.commit()
    conn.close()

    user_data = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        avatar_url=user["avatar_url"],
        xp=user["xp"] or 0,
        streak=streak,
        last_active_date=today_str,
        created_at=user["created_at"]
    )

    token = create_access_token({"sub": str(user["id"]), "email": email})
    return TokenResponse(access_token=token, user=user_data)

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: dict = Depends(get_current_user)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        avatar_url=user["avatar_url"],
        xp=user["xp"] or 0,
        streak=user["streak"] or 1,
        last_active_date=user["last_active_date"],
        created_at=user["created_at"]
    )
