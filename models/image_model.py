import torch
import torch.nn as nn
from torchvision import models

class ImageRiskModel(nn.Module):
    """
    CNN-based model for cancer risk prediction using transfer learning.
    Uses EfficientNet-B0 as the backbone.
    """
    def __init__(self, num_classes=2, pretrained=True):
        super(ImageRiskModel, self).__init__()
        # Load pre-trained EfficientNet-B0
        self.backbone = models.efficientnet_b0(weights='IMAGENET1K_V1' if pretrained else None)
        
        # Modify the classifier head for our specific task
        # EfficientNet-B0 classifier input features is 1280
        in_features = self.backbone.classifier[1].in_features
        
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.4, inplace=True),
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(p=0.2),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)

    def get_embeddings(self, x):
        """
        Extract features before the final classification layer.
        Useful for multimodal fusion.
        """
        # Get features from backbone
        features = self.backbone.features(x)
        features = self.backbone.avgpool(features)
        features = torch.flatten(features, 1)
        return features

if __name__ == "__main__":
    # Quick Test
    model = ImageRiskModel(num_classes=3) # Low, Medium, High
    print(f"Model initialized: {model}")
    
    # Mock input (Batch, Channel, Height, Width)
    dummy_input = torch.randn(1, 3, 224, 224)
    output = model(dummy_input)
    print(f"Output shape: {output.shape}")
    
    embeddings = model.get_embeddings(dummy_input)
    print(f"Embeddings shape: {embeddings.shape}")
