"""Weather, Carbon, Diagnoses, Chat, Orders, Products API routers."""
from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

router = APIRouter()

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

# 3. Diagnoses
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
    return {
        "id": f"diag-{file.filename}",
        "crop": crop or "Tomato",
        "disease": "Early Blight (Alternaria solani)",
        "confidence": 0.92,
        "image_url": "/images/tomato_early_blight.jpg",
        "symptoms": "Concentric target spots detected on foliage with mild chlorosis.",
        "recommended_action": "Apply 5ml/L organic neem seed kernel extract and reduce leaf wetness period."
    }

# 4. Chat
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
    msg = payload.message.lower()
    if "co2" in msg or "carbon" in msg or "calculate" in msg:
        reply = "Based on your acreage, adopting biochar application + cover crops can sequester ~1.15 tCO₂e per acre per year directly in your topsoil!"
    elif "pest" in msg or "blight" in msg or "disease" in msg:
        reply = "For early blight on tomato leaves, prune infected lower leaves and apply 5ml/L neem oil solution during early morning hours."
    else:
        reply = "Namaste! As your Krishi Mitra AI Advisor, I can help you compute carbon sequestration, select certified biochar, and manage organic crop health."
    return {"reply": reply}

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
