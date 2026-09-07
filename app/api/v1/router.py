"""V1 API Router aggregation."""
from fastapi import APIRouter
from app.api.v1.endpoints import auth, farms, tasks, misc, seed

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(farms.router, prefix="/farms", tags=["farms"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(misc.router, tags=["misc"])
api_router.include_router(seed.router, tags=["seed"])
