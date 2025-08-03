from fastapi import APIRouter

from . import auth, users, cv, personas, gap_analysis, export

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(cv.router)
api_router.include_router(personas.router)
api_router.include_router(gap_analysis.router)
api_router.include_router(export.router)
