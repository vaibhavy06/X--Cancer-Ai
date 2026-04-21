import numpy as np
import base64
from io import BytesIO
from PIL import Image
import time

class PredictionService:
    """
    Mock inference service that simulates model behavior when ML dependencies 
    are still installing or unavailable. This ensures the UI is interactive ASAP.
    """
    def __init__(self):
        print("Using Mock Prediction Service (ML Dependencies not yet ready)")

    def predict(self, pil_image, tabular_dict):
        # Simulate processing time
        time.sleep(1.5)
        
        # Determine risk based on some dummy logic from input
        age = int(tabular_dict.get('age', 50))
        smoking = float(tabular_dict.get('smoking_status', 0))
        
        score = (age / 100) * 0.4 + (smoking * 0.5) + (np.random.rand() * 0.1)
        
        if score > 0.7:
            risk_label = "High"
            prob = 0.85 + (np.random.rand() * 0.1)
            color = (239, 68, 68) # Red
        elif score > 0.4:
            risk_label = "Medium"
            prob = 0.65 + (np.random.rand() * 0.1)
            color = (234, 179, 8) # Yellow
        else:
            risk_label = "Low"
            prob = 0.9 + (np.random.rand() * 0.05)
            color = (34, 197, 94) # Green

        # Create a mock heatmap (Blue-ish overlay with a 'tumor' spot)
        heatmap_img = pil_image.resize((224, 224)).convert("RGB")
        heatmap_np = np.array(heatmap_img)
        
        # Add a mock 'hotspot' circle
        center = (112, 112)
        radius = 40
        Y, X = np.ogrid[:224, :224]
        dist_from_center = np.sqrt((X - center[0])**2 + (Y - center[1])**2)
        mask = dist_from_center <= radius
        
        # Blend with red/yellow
        heatmap_np[mask] = (heatmap_np[mask] * 0.3 + np.array([255, 0, 0]) * 0.7).astype(np.uint8)
        
        # Convert to base64
        buffered = BytesIO()
        heatmap_pil = Image.fromarray(heatmap_np)
        heatmap_pil.save(buffered, format="PNG")
        heatmap_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        return {
            "probability": float(prob),
            "risk_score": float(score),
            "risk_category": risk_label,
            "all_probabilities": {
                "Low": 1.0 - score if score < 0.5 else 0.1,
                "Medium": 0.4 if 0.3 < score < 0.7 else 0.2,
                "High": score if score > 0.5 else 0.05
            },
            "explanation": {
                "image_heatmap": f"data:image/png;base64,{heatmap_base64}",
                "feature_importance": [
                    {"feature": k, "importance": float(np.random.rand())} 
                    for k, v in tabular_dict.items()
                ]
            }
        }
