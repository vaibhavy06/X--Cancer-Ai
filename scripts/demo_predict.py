import torch
from PIL import Image
import numpy as np
from models.image_model import ImageRiskModel
from explainability.gradcam import ImageExplainer
import matplotlib.pyplot as plt

def run_demo():
    print("Running Local Inference Demo...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # 1. Load Model
    model = ImageRiskModel(num_classes=3).to(device).eval()
    
    # 2. Create Dummy Image (224x224 RGB)
    dummy_img_np = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
    pil_img = Image.fromarray(dummy_img_np)
    
    # Preprocess
    from torchvision import transforms
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    img_tensor = transform(pil_img).unsqueeze(0).to(device)
    
    # 3. Predict & Explain
    with torch.no_grad():
        output = model(img_tensor)
        risk_idx = torch.argmax(output, dim=1).item()
    
    explainer = ImageExplainer(model)
    heatmap, cam = explainer.generate_heatmap(img_tensor, target_category=risk_idx, original_image=dummy_img_np)
    
    print(f"Predicted Risk Category: {['Low', 'Medium', 'High'][risk_idx]}")
    print("Grad-CAM Heatmap generated successfully.")
    
    # Save demo result
    res_img = Image.fromarray(heatmap)
    res_img.save("demo_heatmap.png")
    print("Saved demo heatmap to demo_heatmap.png")

if __name__ == "__main__":
    try:
        run_demo()
    except Exception as e:
        print(f"Note: Demo requires installed dependencies. Error: {e}")
