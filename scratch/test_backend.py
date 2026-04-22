import httpx
import json
import io
from PIL import Image

def test_predict():
    url = "http://127.0.0.1:8000/api/v1/predict"
    
    # Create a dummy image
    img = Image.new('RGB', (224, 224), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    
    # Patient data
    patient_data = {
        "age": 45,
        "bmi": 25.5,
        "blood_pressure": 120,
        "cholesterol": 200,
        "family_history": 1,
        "smoking_status": 0
    }
    
    files = {'image': ('test.png', img_byte_arr, 'image/png')}
    data = {'patient_data': json.dumps(patient_data)}
    
    print(f"Sending request to {url}...")
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, files=files, data=data)
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("Prediction Success!")
            print(f"Risk Category: {result['risk_category']}")
            print(f"Probability: {result['probability']}")
            print("Explanation Keys:", result['explanation'].keys())
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_predict()
