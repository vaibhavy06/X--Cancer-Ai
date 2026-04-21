import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms, datasets
from models.image_model import ImageRiskModel
import os
import time
from sklearn.metrics import classification_report, f1_score

# --- Configuration ---
BATCH_SIZE = 32
EPOCHS = 10
LEARNING_RATE = 0.001
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
DATA_DIR = "./data/images"
MODEL_SAVE_PATH = "./models/image_model.pth"

# --- Data Preprocessing ---
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def train_model():
    print(f"Starting training on {DEVICE}...")
    
    # Check if data directory exists, otherwise use synthetic data for demo
    if not os.path.exists(DATA_DIR):
        print("Data directory not found. Using synthetic data for demonstration.")
        # Create dummy datasets
        class SyntheticDataset(Dataset):
            def __init__(self, size, transform):
                self.size = size
                self.transform = transform
            def __len__(self): return self.size
            def __getitem__(self, idx):
                img = torch.randn(3, 224, 224)
                label = torch.randint(0, 3, (1,)).item() # 3 classes: Low, Med, High
                return img, label
        
        train_dataset = SyntheticDataset(100, train_transform)
        val_dataset = SyntheticDataset(20, val_transform)
    else:
        # Load from folder (expects structure: data/images/train/ClassA, ClassB...)
        train_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, 'train'), transform=train_transform)
        val_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, 'val'), transform=val_transform)

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE)

    # Initialize model
    model = ImageRiskModel(num_classes=3).to(DEVICE)
    
    # Loss and Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    
    # Training Loop
    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        
        for images, labels in train_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
        
        print(f"Epoch [{epoch+1}/{EPOCHS}] - Loss: {running_loss/len(train_loader):.4f}")
        
        # Validation
        model.eval()
        all_preds = []
        all_labels = []
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)
                outputs = model(images)
                _, preds = torch.max(outputs, 1)
                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
        
        f1 = f1_score(all_labels, all_preds, average='weighted')
        print(f"Validation F1 Score: {f1:.4f}")

    # Save model
    torch.save(model.state_dict(), MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")

    # Final Report
    print("\nFinal Classification Report:")
    print(classification_report(all_labels, all_preds))

if __name__ == "__main__":
    # Create directory if not exists
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    train_model()
