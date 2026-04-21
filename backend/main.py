from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import predict
import uvicorn

app = FastAPI(
    title="X-Cancer AI API",
    description="Explainable Multimodal Cancer Risk Prediction System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(predict.router, prefix="/api/v1", tags=["Prediction"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to X-Cancer AI API",
        "status": "Healthy",
        "disclaimer": "For research purposes only"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
