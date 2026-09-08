"""Farms API router."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class FarmResponse(BaseModel):
    id: str
    name: str
    total_land_acres: float
    soil_type: str
    soil_organic_carbon: float
    soil_health: str
    primary_crops: str
    farming_type: str
    irrigation_type: str
    location: str

class OnboardingPayload(BaseModel):
    name: Optional[str] = "Ramesh Patil"
    landAcres: Optional[float] = 5.0
    soilType: Optional[str] = "Red Loamy Soil"
    soilOrganicCarbon: Optional[float] = 0.65
    soilHealth: Optional[str] = "Medium (0.65% SOC)"
    primaryCrops: Optional[str] = "Tomato, Cotton, Pulses"
    farmingType: Optional[str] = "Certified Organic"
    irrigationType: Optional[str] = "Drip & Borewell"
    location: Optional[str] = "Mandya, Karnataka, India"

@router.get("/me", response_model=FarmResponse)
async def get_my_farm():
    return {
        "id": "farm-001",
        "name": "Mandya Organic Farm",
        "total_land_acres": 5.0,
        "soil_type": "Red Loamy Soil",
        "soil_organic_carbon": 0.65,
        "soil_health": "Medium (0.65% SOC)",
        "primary_crops": "Tomato, Cotton, Pulses",
        "farming_type": "Certified Organic",
        "irrigation_type": "Drip & Borewell",
        "location": "Mandya, Karnataka, India",
    }

@router.post("/onboarding", response_model=FarmResponse)
async def complete_onboarding(payload: OnboardingPayload):
    return {
        "id": "farm-001",
        "name": "Mandya Organic Farm",
        "total_land_acres": payload.landAcres or 5.0,
        "soil_type": payload.soilType or "Red Loamy Soil",
        "soil_organic_carbon": payload.soilOrganicCarbon or 0.65,
        "soil_health": payload.soilHealth or "Medium (0.65% SOC)",
        "primary_crops": payload.primaryCrops or "Tomato, Cotton, Pulses",
        "farming_type": payload.farmingType or "Certified Organic",
        "irrigation_type": payload.irrigationType or "Drip & Borewell",
        "location": payload.location or "Mandya, Karnataka, India",
    }
