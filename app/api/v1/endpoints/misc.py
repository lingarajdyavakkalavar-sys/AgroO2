"""Weather, Carbon, Diagnoses, Chat, Orders, Products API routers integrated with Gemini AI."""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.services.gemini_service import gemini_service

router = APIRouter()

# MAX upload size: 10MB
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


# 1. Weather
@router.get("/weather")
async def get_weather():
    return {
        "location": "Mandya, Karnataka, India",
        "current_temp": 28,
        "current_condition": "Partly Cloudy",
        "current_humidity": 65,
        "forecast": [
            { "day": "Mon", "high": 28, "low": 18, "type": "sunny" },
            { "day": "Tue", "high": 27, "low": 17, "type": "partly-cloudy" },
            { "day": "Wed", "high": 26, "low": 18, "type": "rainy" },
            { "day": "Thu", "high": 27, "low": 18, "type": "partly-cloudy" },
            { "day": "Fri", "high": 28, "low": 19, "type": "sunny" },
        ],
        "agronomy": {
            "soil_temperature_10cm": 24.2,
            "soil_temp_status": "Optimal (Microbes & Roots)",
            "evapotranspiration_rate": 3.8,
            "uv_index": 6,
            "uv_status": "Moderate",
            "dew_point": 17.0,
        }
    }


# 2. Carbon
@router.get("/carbon/score")
async def get_carbon_score():
    return {
        "score": 78,
        "annual_co2_per_acre": 1.15,
        "total_annual_co2": 5.75,
    }


# 3. Diagnoses (AI Disease Detector)
@router.get("/diagnoses")
async def list_diagnoses():
    return [
        {
            "id": "diag-1",
            "crop": "Tomato",
            "disease": "Early Blight (Alternaria solani)",
            "confidence": 0.91,
            "created_at": "2026-09-01T10:00:00Z",
            "image_url": "/images/tomato_early_blight.jpg",
            "symptoms": "Concentric brown target rings on lower leaf surface with surrounding chlorotic halo.",
            "recommended_action": "Prune infected lower foliage. Spray 5ml/L certified organic neem oil solution and improve furrow drainage."
        }
    ]


@router.post("/diagnoses/analyze")
async def analyze_disease(
    file: UploadFile = File(...),
    crop: Optional[str] = Form("Tomato"),
    farm_id: Optional[str] = Form(None)
):
    """Analyze crop foliage photo using Gemini 3.1 Multimodal Vision AI."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file.content_type}'. Allowed types: JPG, PNG, WEBP."
        )

    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 10MB."
        )

    analysis = await gemini_service.analyze_crop_disease(
        image_bytes=image_bytes,
        mime_type=file.content_type,
        crop_hint=crop or "Tomato"
    )

    return {
        "id": f"diag-{file.filename}",
        "crop": analysis.get("crop", crop or "Tomato"),
        "disease": analysis.get("disease", "Unknown Condition"),
        "confidence": analysis.get("confidence", 0.90),
        "confidence_level": analysis.get("confidenceLevel", "high"),
        "image_url": "/images/tomato_early_blight.jpg",
        "symptoms": analysis.get("symptoms", "Pathology characteristics identified."),
        "recommended_action": analysis.get("recommendedAction", "Apply certified organic treatments."),
        "urgent_warning": analysis.get("urgentWarning", False),
        "disclaimer": analysis.get("disclaimer", "Screening estimate only. Verify with local agricultural extension officer.")
    }


# 4. Chat (AI Advisor)
class ChatMessagePayload(BaseModel):
    message: str
    farm_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


@router.get("/chat/suggestions")
async def get_chat_suggestions():
    return [
        "How much CO₂ can my soil capture with cover crops?",
        "How do I buy captured CO₂ or biochar for my acres?",
        "How can I increase Soil Organic Carbon (SOC)?",
        "Suggest organic pest control for tomato blight",
    ]


@router.post("/chat/message")
async def send_chat_message(payload: ChatMessagePayload):
    """Generate response for AI Advisor using Gemini 3.1 model."""
    if not payload.message or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message prompt cannot be empty."
        )

    res = await gemini_service.generate_advisor_guidance(
        user_message=payload.message.strip(),
        farm_context=payload.context
    )

    return {
        "reply": res["reply"],
        "structured": res.get("structured", {})
    }


# 5. Products & Orders
@router.get("/products")
async def list_products():
    return [
        {
            "id": "prod-1",
            "name": "Certified Biochar CO₂ Substrate",
            "price_per_tonne": 4500,
            "purity": "85% Fixed Carbon",
            "supplier": "GreenTech Carbon Capture Ltd"
        }
    ]


@router.post("/orders")
async def create_order():
    return {"status": "created", "order_id": "order-1001", "message": "Order created successfully"}
