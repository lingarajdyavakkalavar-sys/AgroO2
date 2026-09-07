"""Main FastAPI application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.firebase import init_firebase
from app.api.v1.router import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    try:
        init_firebase()
    except Exception as e:
        print(f"Firebase init note: {e}")
    try:
        from app.api.v1.endpoints.seed import seed_products, seed_test_user
        await seed_products()
        await seed_test_user()
    except Exception as e:
        print(f"Startup seed note: {e}")
    yield
    # Shutdown (if needed)


app = FastAPI(
    title="PlanT CO₂ Farm API",
    description="Backend API for PlanT CO₂ Farm - Sustainable Farming Assistant",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL] if settings.FRONTEND_URL else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": settings.APP_ENV,
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "PlanT CO₂ Farm API",
        "version": "1.0.0",
        "docs": "/docs",
    }
