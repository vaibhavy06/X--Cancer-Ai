import xgboost as xgb
import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score

class TabularRiskModel:
    """
    XGBoost-based model for cancer risk prediction using patient clinical data.
    """
    def __init__(self, model_path="./models/tabular_model.pkl"):
        self.model_path = model_path
        self.model = None
        self.scaler = StandardScaler()

    def preprocess(self, df):
        """
        Handle missing values and scale features.
        """
        # Fill numeric NaNs with median
        df = df.fillna(df.median(numeric_only=True))
        
        # Scale features
        # Note: In a real scenario, we'd fit the scaler only on training data
        return df

    def train(self, X, y):
        """
        Train XGBoost classifier.
        """
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale data
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        self.model = xgb.XGBClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            objective='multi:softprob',
            num_class=3, # Low, Medium, High
            use_label_encoder=False,
            eval_metric='mlogloss'
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        preds = self.model.predict(X_test_scaled)
        print(f"Accuracy: {accuracy_score(y_test, preds):.4f}")
        print("\nTabular Model Classification Report:")
        print(classification_report(y_test, preds))
        
        # Save model and scaler
        self.save()

    def save(self):
        with open(self.model_path, 'wb') as f:
            pickle.dump({'model': self.model, 'scaler': self.scaler}, f)
        print(f"Tabular model saved to {self.model_path}")

    def load(self):
        if os.path.exists(self.model_path):
            with open(self.model_path, 'rb') as f:
                data = pickle.load(f)
                self.model = data['model']
                self.scaler = data['scaler']
        else:
            raise FileNotFoundError("Tabular model file not found.")

    def predict_proba(self, X):
        if self.model is None: self.load()
        X_scaled = self.scaler.transform(X)
        return self.model.predict_proba(X_scaled)

if __name__ == "__main__":
    # Generate Synthetic Data for testing
    np.random.seed(42)
    num_samples = 1000
    features = ['age', 'bmi', 'blood_pressure', 'cholesterol', 'family_history', 'smoking_status']
    X = pd.DataFrame(np.random.rand(num_samples, len(features)), columns=features)
    # 0: Low, 1: Medium, 2: High risk
    y = np.random.randint(0, 3, num_samples)
    
    trainer = TabularRiskModel()
    trainer.train(X, y)
