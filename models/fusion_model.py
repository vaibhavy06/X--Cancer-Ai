import torch
import torch.nn as nn
import torch.nn.functional as F

class FusionRiskModel(nn.Module):
    """
    Multimodal Fusion Model that combines Image and Tabular features.
    """
    def __init__(self, image_embedding_dim=1280, tabular_dim=6, num_classes=3):
        super(FusionRiskModel, self).__init__()
        
        # Branch for Tabular data processing (if we want to extract features)
        self.tabular_fc = nn.Sequential(
            nn.Linear(tabular_dim, 64),
            nn.ReLU(),
            nn.BatchNorm1d(64)
        )
        
        # Fusion Layers
        # image_embedding_dim (1280 from EfficientNet-B0) + 64 (from tabular branch)
        self.fusion_fc = nn.Sequential(
            nn.Linear(image_embedding_dim + 64, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, num_classes)
        )

    def forward(self, img_embeddings, tabular_data):
        """
        img_embeddings: [batch_size, 1280]
        tabular_data: [batch_size, tabular_dim]
        """
        # Process tabular data
        tab_features = self.tabular_fc(tabular_data)
        
        # Concatenate features
        combined = torch.cat((img_embeddings, tab_features), dim=1)
        
        # Final prediction
        logits = self.fusion_fc(combined)
        return logits

if __name__ == "__main__":
    # Test fusion
    batch_size = 4
    img_emb = torch.randn(batch_size, 1280)
    tab_data = torch.randn(batch_size, 6)
    
    model = FusionRiskModel(image_embedding_dim=1280, tabular_dim=6, num_classes=3)
    output = model(img_emb, tab_data)
    
    print(f"Fusion Output Shape: {output.shape}")
    print(f"Probabilities: {F.softmax(output, dim=1)}")
