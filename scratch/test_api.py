import requests
try:
    response = requests.get("http://localhost:8000/")
    print(response.status_code)
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
