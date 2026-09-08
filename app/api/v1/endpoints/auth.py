"""Authentication API router."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class UserSeedResponse(BaseModel):
    status: str
    user: dict

@router.post("/seed-test-user", response_model=UserSeedResponse)
async def seed_test_user_endpoint():
    user = {
        "uid": "test-farmer-001",
        "name": "Ramesh Patil",
        "email": "ramesh.patil.organic@gmail.com",
        "phone": "+91 98450 12345",
        "role": "Organic Farmer",
        "location": "Mandya, Karnataka, India",
        "land_acres": 5.0,
        "total_land_acres": 5.0,
        "soil_type": "Red Loamy Soil",
        "soil_health": "Medium (0.65% SOC)",
        "soil_organic_carbon": 0.65,
        "primary_crops": "Tomato, Cotton, Pulses",
        "farming_type": "Certified Organic",
        "irrigation_type": "Drip & Borewell",
        "has_completed_onboarding": True,
    }
    return {"status": "success", "user": user}
