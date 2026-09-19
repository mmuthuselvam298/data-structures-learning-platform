"""
User and Progress Pydantic Data Models
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Minimum 6 characters")
    full_name: str = Field(..., min_length=2, description="User full name or handle")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    xp: int = 0
    streak: int = 1
    last_active_date: Optional[str] = None
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LessonCompleteRequest(BaseModel):
    lesson_id: str
    unit_id: str

class QuizAttemptRequest(BaseModel):
    quiz_id: str
    score: int
    max_score: int

class ChallengeAttemptRequest(BaseModel):
    challenge_id: str
    difficulty: str
    score: int
    max_score: int
    time_seconds: int
    mistakes: Optional[List[Dict[str, Any]]] = []

class VisualLabStateRequest(BaseModel):
    topic: str
    state_json: Dict[str, Any]

class ProgressResponse(BaseModel):
    user: UserResponse
    completed_lessons: List[str]
    quiz_attempts: List[Dict[str, Any]]
    challenge_attempts: List[Dict[str, Any]]
    achievements: List[str]
    quiz_average: float
    challenges_completed: int
    best_challenge_score: int
