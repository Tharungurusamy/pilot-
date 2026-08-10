from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI()

# Load models at startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

class PredictionRequest(BaseModel):
    text: str

models = {}

@app.on_event("startup")
def load_models():
    try:
        # Category models
        models["category_model"] = joblib.load(os.path.join(MODELS_DIR, "category_model.joblib"))
        models["tfidf_cat"] = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.joblib"))
        models["level_encoder"] = joblib.load(os.path.join(MODELS_DIR, "level_encoder.joblib"))
        
        # Priority models
        models["priority_model"] = joblib.load(os.path.join(MODELS_DIR, "priority_model.joblib"))
        models["tfidf_prio"] = joblib.load(os.path.join(MODELS_DIR, "priority_tfidf.joblib"))
        models["priority_encoder"] = joblib.load(os.path.join(MODELS_DIR, "priority_encoder.joblib"))
        print("All models loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {e}")

@app.post("/predict")
def predict(request: PredictionRequest):
    if not models.get("category_model"):
        raise HTTPException(status_code=500, detail="Models are not loaded.")

    try:
        text = request.text
        
        # 1. Predict Category
        x_cat = models["tfidf_cat"].transform([text])
        pred_cat_encoded = models["category_model"].predict(x_cat)
        category_label = models["level_encoder"].inverse_transform(pred_cat_encoded)[0]
        
        # 2. Predict Priority
        x_prio = models["tfidf_prio"].transform([text])
        pred_prio_encoded = models["priority_model"].predict(x_prio)
        priority_label = models["priority_encoder"].inverse_transform(pred_prio_encoded)[0]
        
        return {
            "text": text,
            "category": category_label,
            "priority": priority_label
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
