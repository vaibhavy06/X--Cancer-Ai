import numpy as np
import cv2
import torch
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

class ImageExplainer:
    """
    Wrapper for Grad-CAM to visualize tumor regions spotlighted by the model.
    """
    def __init__(self, model, target_layers=None):
        """
        target_layers: The layers to compute Grad-CAM for. 
        For EfficientNet, usually the last convolutional layer.
        """
        self.model = model
        if target_layers is None:
            # For EfficientNet-B0, 'features' contains the conv layers
            self.target_layers = [model.backbone.features[-1]]
        else:
            self.target_layers = target_layers
            
        self.cam = GradCAM(model=self.model, target_layers=self.target_layers)

    def generate_heatmap(self, input_tensor, target_category=None, original_image=None):
        """
        input_tensor: Preprocessed image tensor [1, 3, 224, 224]
        target_category: Index of the class to explain
        original_image: Raw image (numpy) for overlay [H, W, 3]
        """
        # If no target category, use the model's prediction
        if target_category is None:
            outputs = self.model(input_tensor)
            target_category = torch.argmax(outputs, dim=1).item()
            
        targets = [ClassifierOutputTarget(target_category)]
        
        # Generate grayscale CAM
        grayscale_cam = self.cam(input_tensor=input_tensor, targets=targets)
        grayscale_cam = grayscale_cam[0, :]
        
        if original_image is not None:
            # Normalize original image to [0, 1]
            input_image = original_image.astype(np.float32) / 255
            # Overlay CAM on image
            visualization = show_cam_on_image(input_image, grayscale_cam, use_rgb=True)
            return visualization, grayscale_cam
        
        return grayscale_cam
