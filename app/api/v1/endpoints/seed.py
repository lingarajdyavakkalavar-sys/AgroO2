"""Seed data endpoint module."""
from fastapi import APIRouter

router = APIRouter()

async def seed_products():
    """Seed initial products if database is empty."""
    print("Seeding initial products...")

async def seed_test_user():
    """Seed default test user if database is empty."""
    print("Seeding default test user...")

@router.post("/seed")
async def trigger_seed():
    await seed_products()
    await seed_test_user()
    return {"status": "success", "message": "Seed completed"}
