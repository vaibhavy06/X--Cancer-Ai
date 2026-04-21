from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import json
import io
from PIL import Image
import numpy as np
from backend.services.inference import PredictionService

router = APIRouter()
predictor = PredictionService()

@router.post("/predict")
async def predict_risk(
    image: UploadFile = File(...),
    patient_data: str = Form(...) # Expecting JSON string
):
    """
    Endpoint to receive medical image and tabular data, returning prediction and explanations.
    """
    try:
        # Parse patient data
        data_dict = json.loads(patient_data)
        
        # Read image
        image_content = await image.read()
        pil_image = Image.open(io.BytesIO(image_content)).convert("RGB")
        
        # Run inference
        result = predictor.predict(pil_image, data_dict)
        
        return result
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for patient_data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-info")
async def get_model_info():
    return {
        "image_model": "EfficientNet-B0",
        "tabular_model": "XGBoost",
        "fusion": "Multimodal MLP",
        "classes": ["Low Risk", "Medium Risk", "High Risk"]
    }
