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

class PredictionService:
    def __init__(self):
        self.torch_available = TORCH_AVAILABLE
        if not self.torch_available:
            self.mock_service = MockPredictionService()
            return

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Initialize Models (Ideally would load weights here)
        self.image_model = ImageRiskModel(num_classes=3).to(self.device).eval()
        self.tabular_model = TabularRiskModel()
        self.fusion_model = FusionRiskModel().to(self.device).eval()
        
        # Preprocessing
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Explainer
        self.image_explainer = ImageExplainer(self.image_model)

    def predict(self, pil_image, tabular_dict):
        if not self.torch_available:
            return self.mock_service.predict(pil_image, tabular_dict)

        # 1. Process Image
        img_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
        
        # 2. Extract Image Embeddings
        with torch.no_grad():
            img_embeddings = self.image_model.get_embeddings(img_tensor)
        
        # 3. Process Tabular Data
        # In a real scenario, we'd use the model's scaler
        # For now, create a dummy dataframe
        df = pd.DataFrame([tabular_dict])
        tab_tensor = torch.FloatTensor(df.values).to(self.device)
        
        # 4. Fusion Prediction
        with torch.no_grad():
            logits = self.fusion_model(img_embeddings, tab_tensor)
            probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
        
        risk_idx = np.argmax(probs)
        risk_label = ["Low", "Medium", "High"][risk_idx]
        
        # 5. Generate Explanation (Grad-CAM)
        heatmap, cam = self.image_explainer.generate_heatmap(img_tensor, target_category=risk_idx, original_image=np.array(pil_image.resize((224, 224))))
        
        # Convert heatmap to base64 for frontend
        buffered = BytesIO()
        heatmap_pil = Image.fromarray(heatmap)
        heatmap_pil.save(buffered, format="PNG")
        heatmap_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        return {
            "probability": float(probs[risk_idx]),
            "risk_score": float(np.max(probs)),
            "risk_category": risk_label,
            "all_probabilities": {
                "Low": float(probs[0]),
                "Medium": float(probs[1]),
                "High": float(probs[2])
            },
            "explanation": {
                "image_heatmap": f"data:image/png;base64,{heatmap_base64}",
                "feature_importance": [
                    {"feature": k, "importance": float(v) if isinstance(v, (int, float)) else 0.5} 
                    for k, v in tabular_dict.items()
                ]
            }
        }
