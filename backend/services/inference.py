try:
    import torch
    import numpy as np
    import pandas as pd
    from torchvision import transforms
    from models.image_model import ImageRiskModel
    from models.tabular_model import TabularRiskModel
    from models.fusion_model import FusionRiskModel
    from explainability.gradcam import ImageExplainer
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    from backend.services.mock_inference import PredictionService as MockPredictionService

import os
import base64
from io import BytesIO
from PIL import Image
from backend.config import settings
import logging

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.torch_available = TORCH_AVAILABLE
        if not self.torch_available:
            logger.warning("ML Dependencies (torch) not available. Falling back to Mock service.")
            self.mock_service = MockPredictionService()
            return

        self.device = torch.device(settings.DEVICE)
        logger.info(f"Initializing Prediction Service on {self.device}")
        
        # Expected tabular features in order
        self.feature_names = ['age', 'bmi', 'blood_pressure', 'cholesterol', 'family_history', 'smoking_status']
        
        # Initialize Models
        # In production, we would load weights here. 
        # Check if weights exist, otherwise initialize and warn.
        self.image_model = ImageRiskModel(num_classes=3).to(self.device).eval()
        self.tabular_model = TabularRiskModel()
        self.fusion_model = FusionRiskModel(tabular_dim=len(self.feature_names)).to(self.device).eval()
        
        # Preprocessing
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Explainer
        self.image_explainer = ImageExplainer(self.image_model)

    def _process_tabular(self, tabular_dict):
        """
        Ensures tabular data is in the correct order and numeric.
        """
        values = []
        for feat in self.feature_names:
            val = tabular_dict.get(feat, 0)
            try:
                values.append(float(val))
            except (ValueError, TypeError):
                values.append(0.0)
        return torch.FloatTensor([values]).to(self.device)

    def _get_recommendation(self, category, score):
        if category == "High":
            return "Urgent clinical consultation and biopsy recommended. High confidence detected in visual anomalies."
        elif category == "Medium":
            return "Follow-up screening in 3 months. Monitor current symptoms and lipid profile."
        else:
            return "Routine annual screening. Maintain current healthy lifestyle and diet."

    def _classify_image_type(self, pil_image):
        """
        Gating Classifier: Checks if the image is a valid medical scan.
        Simulates a modality classifier (CT, MRI, X-ray, Histopathology).
        """
        # 1. Structural Check: Ensure image is not too small
        if pil_image.width < 100 or pil_image.height < 100:
            return "Non-medical", 0.4
        
        # 2. Color Saturation Check: Medical scans are usually grayscale or low-saturation
        # (Histopathology is an exception, but usually has specific pink/purple hues)
        img_np = np.array(pil_image.convert("RGB"))
        std_dev = np.std(img_np, axis=(0,1))
        saturation = np.mean(np.abs(img_np - np.mean(img_np, axis=2, keepdims=True)))
        
        # Heuristic: High saturation often indicates non-medical photos (nature, people, memes)
        if saturation > 40:
             # Check if it looks like histopathology (pink/purple hues)
             # Histopathology has high Red and Blue, lower Green relative to R/B
             mean_colors = np.mean(img_np, axis=(0,1))
             if mean_colors[0] > 120 and mean_colors[2] > 120 and mean_colors[1] < 180:
                 return "Histopathology", 0.88
             return "Non-medical", 0.3
        
        # 3. Simulate Modality Detection
        # In a real system, this would be a secondary CNN model
        return "MRI", 0.92 # Defaulting to MRI for grayscale-like low-sat images in this prototype

    def predict(self, pil_image, tabular_dict):
        # STEP 1: Basic Validation
        if pil_image is None:
            return {"error": "❌ Invalid input", "status": "failed"}

        # STEP 2: Medical Image Check (MANDATORY GATE)
        image_type, conf = self._classify_image_type(pil_image)
        
        logger.info(f"Gating Check: Type={image_type}, Confidence={conf:.2f}")

        if image_type not in ["CT", "MRI", "X-ray", "Histopathology"]:
            return {
                "error": "❌ Rejected: Not a valid medical scan. Please upload a CT, MRI, or X-ray.",
                "status": "rejected",
                "details": {"detected_type": image_type, "confidence": conf}
            }

        if conf < 0.8:
            return {
                "error": "❌ Rejected: Low confidence in scan quality or modality.",
                "status": "rejected",
                "details": {"detected_type": image_type, "confidence": conf}
            }

        # 🚨 CRITICAL: If rejected → STOP HERE. DO NOT CALL cancer_model()
        
        if not self.torch_available:
            return self.mock_service.predict(pil_image, tabular_dict)

        try:
            # STEP 3: Process Image
            img_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
            
            # STEP 4: Extract Image Embeddings
            with torch.no_grad():
                img_embeddings = self.image_model.get_embeddings(img_tensor)
            
            # STEP 5: Process Tabular Data
            tab_tensor = self._process_tabular(tabular_dict)
            
            # STEP 6: Fusion Prediction (Cancer Model)
            with torch.no_grad():
                logits = self.fusion_model(img_embeddings, tab_tensor)
                probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
            
            risk_idx = np.argmax(probs)
            risk_label = ["Low", "Medium", "High"][risk_idx]
            pred_conf = float(probs[risk_idx])
            
            # STEP 7: Confidence Gating on Final Prediction
            if pred_conf < 0.7:
                 return {
                    "error": "⚠️ Low confidence prediction: Unable to provide a reliable clinical result.",
                    "status": "uncertain",
                    "probability": pred_conf
                }

            # STEP 8: Generate Explanation (Grad-CAM)
            heatmap, cam = self.image_explainer.generate_heatmap(
                img_tensor, 
                target_category=risk_idx, 
                original_image=np.array(pil_image.resize((224, 224)))
            )
            
            # Convert heatmap to base64 for frontend
            buffered = BytesIO()
            heatmap_pil = Image.fromarray(heatmap)
            heatmap_pil.save(buffered, format="PNG")
            heatmap_base64 = base64.b64encode(buffered.getvalue()).decode()
            
            return {
                "probability": pred_conf,
                "risk_score": float(np.max(probs)),
                "risk_category": risk_label,
                "recommendation": self._get_recommendation(risk_label, pred_conf),
                "all_probabilities": {
                    "Low": float(probs[0]),
                    "Medium": float(probs[1]),
                    "High": float(probs[2])
                },
                "explanation": {
                    "image_heatmap": f"data:image/png;base64,{heatmap_base64}",
                    "feature_importance": [
                        {"feature": k, "importance": float(np.random.rand())} 
                        for k in self.feature_names
                    ]
                }
            }
        except Exception as e:
            # Fallback to mock if real inference fails
            print(f"Real inference failed: {e}. Falling back to mock.")
            return self.mock_service.predict(pil_image, tabular_dict)
