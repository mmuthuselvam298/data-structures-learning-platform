"""
DS Playground FastAPI Application Entrypoint
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.router import router
from backend.api.auth import router as auth_router
from backend.api.user import router as user_router
from backend.services.database import init_db

# Initialize database schema on startup
init_db()

app = FastAPI(
    title="DS Playground — Interactive Simulation Engine",
    description="Python simulation backend powering step-by-step state animations for Data Structures in C (SRM University-AP CSE 102).",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api")

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "DS Playground Simulation Engine",
        "syllabus": "SRM University-AP CSE-102 Data Structures",
        "units": ["Unit I", "Unit II", "Unit III", "Unit IV", "Unit V"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
