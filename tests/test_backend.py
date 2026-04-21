from fastapi.testclient import TestClient
from backend.main import app
import json
import io
from PIL import Image

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "Healthy"

def test_model_info():
    response = client.get("/api/v1/model-info")
    assert response.status_code == 200
    assert "image_model" in response.json()

def test_prediction_endpoint():
    # Create a dummy image
    file = io.BytesIO()
    image = Image.new('RGB', (224, 224), color = 'red')
    image.save(file, 'png')
    file.seek(0)
    
    # Dummy patient data
    patient_data = {
        "age": "54",
        "bmi": "24.5",
        "smoking_status": "0.5",
        "family_history": "0"
    }
    
    response = client.post(
        "/api/v1/predict",
        files={"image": ("test.png", file, "image/png")},
        data={"patient_data": json.dumps(patient_data)}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "risk_category" in data
    assert "explanation" in data
    assert "image_heatmap" in data["explanation"]
