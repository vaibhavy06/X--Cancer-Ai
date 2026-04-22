import sys
import os
sys.path.append(os.getcwd())
try:
    import torch
    print("torch ok")
    import numpy
    print("numpy ok")
    import pandas
    print("pandas ok")
    from torchvision import transforms
    print("torchvision ok")
    import xgboost
    print("xgboost ok")
    import sklearn
    print("sklearn ok")
    import cv2
    print("cv2 ok")
    try:
        from pytorch_grad_cam import GradCAM
        print("pytorch_grad_cam ok")
    except ImportError:
        print("pytorch_grad_cam FAILED")
    
    from models.image_model import ImageRiskModel
    print("ImageRiskModel ok")
    from models.tabular_model import TabularRiskModel
    print("TabularRiskModel ok")
    from models.fusion_model import FusionRiskModel
    print("FusionRiskModel ok")
    from explainability.gradcam import ImageExplainer
    print("ImageExplainer ok")
    
    print("\nALL IMPORTS SUCCESSFUL")
except Exception as e:
    print(f"\nIMPORT FAILED: {e}")
    sys.exit(1)
