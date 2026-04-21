import shap
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

class TabularExplainer:
    """
    SHAP-based explanation for patient clinical data features.
    """
    def __init__(self, model, background_data):
        """
        model: Trained XGBoost model
        background_data: A sample of data to use as baseline
        """
        self.explainer = shap.TreeExplainer(model)
        self.background_data = background_data

    def explain_instance(self, instance_df, save_path=None):
        """
        instance_df: Single row DataFrame of patient data
        """
        shap_values = self.explainer.shap_values(instance_df)
        
        # shap_values for multi-class XGBoost is a list of arrays (one per class)
        # We'll take the SHAP values for the predicted class
        # For simplicity in this demo, let's assume we want to show influence on overall risk
        
        # Plotting
        plt.figure(figsize=(10, 6))
        shap.force_plot(
            self.explainer.expected_value[1], # Showing influence on Class 1 (e.g. Medium/High risk)
            shap_values[1], 
            instance_df, 
            matplotlib=True, 
            show=False
        )
        
        if save_path:
            plt.savefig(save_path, bbox_inches='tight')
            plt.close()
            return save_path
        
        return shap_values

def get_feature_importance(model, feature_names):
    """
    Quick global feature importance from XGBoost.
    """
    importance = model.feature_importances_
    indices = np.argsort(importance)[::-1]
    
    report = []
    for f in range(len(feature_names)):
        report.append({
            "feature": feature_names[indices[f]],
            "score": float(importance[indices[f]])
        })
    return report
