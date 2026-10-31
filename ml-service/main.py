"""
EventSphere AI — Predictive Intelligence Engine (FastAPI Service)
Exposes microservice endpoints for the 5 EventSphere ML models.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from models.delay_predictor import DelayPredictor
from models.registration_forecaster import RegistrationForecaster
from models.noshow_predictor import NoShowPredictor
from models.fraud_detector import FraudAnomalyDetector
from models.crowd_predictor import SessionCrowdPredictor
from models.dynamic_pricer import DynamicPricingOptimizer

app = FastAPI(
    title="EventSphere AI Predictive Intelligence Engine",
    version="1.0.0",
    description="Machine Learning service providing event readiness delay prediction, registration forecasting, attendee no-show modeling, ticket fraud detection, and session crowd forecasting."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Models on service startup
print("Initializing EventSphere ML Models...")
delay_model = DelayPredictor()
registration_model = RegistrationForecaster()
noshow_model = NoShowPredictor()
fraud_model = FraudAnomalyDetector()
crowd_model = SessionCrowdPredictor()
pricing_optimizer = DynamicPricingOptimizer()
print("All 6 ML engines (including Dynamic Yield Optimizer) loaded successfully.")


# Pydantic Schemas
class DelayRequest(BaseModel):
    eventId: str
    actualProgress: float = 0.0
    plannedProgress: float = 0.0
    progressGap: float = 0.0
    totalTasks: int = 10
    overdueTasks: int = 0
    blockedTasks: int = 0
    missingMilestones: int = 0
    daysRemaining: int = 14


class RegistrationRequest(BaseModel):
    eventId: str
    currentRegistrations: int = 50
    targetCapacity: int = 500
    daysRemaining: int = 14


class NoShowRequest(BaseModel):
    eventId: str
    totalRegistrations: int = 100


class AnomalyRequest(BaseModel):
    eventId: str
    sampleSize: int = 50


class CrowdRequest(BaseModel):
    eventId: str
    totalRegistrations: int = 400
    sessions: Optional[List[Dict[str, Any]]] = None


class SimilarityRequest(BaseModel):
    text1: str
    text2: str


class DynamicPricingRequest(BaseModel):
    eventId: str
    currentPrice: float = 1499.0
    targetCapacity: int = 1000
    currentSales: int = 250
    daysRemaining: int = 14
    dailyVelocity: float = 12.0
    category: str = "Technology & AI"


@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "EventSphere ML Predictive Intelligence",
        "models": {
            "model_1_delay_risk": "LOADED",
            "model_2_registration_forecast": "LOADED",
            "model_3_noshow_prediction": "LOADED",
            "model_4_fraud_anomaly": "LOADED",
            "model_5_session_crowd": "LOADED",
            "model_6_dynamic_pricing": "LOADED"
        }
    }


@app.post("/predict/delay")
def predict_delay(req: DelayRequest):
    try:
        return delay_model.predict(req.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delay prediction error: {str(e)}")


@app.post("/predict/registrations")
def predict_registrations(req: RegistrationRequest):
    try:
        return registration_model.predict(req.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration forecasting error: {str(e)}")


@app.post("/predict/noshow")
def predict_noshow(req: NoShowRequest):
    try:
        return noshow_model.predict_cohort(req.totalRegistrations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No-show prediction error: {str(e)}")


@app.post("/predict/anomalies")
def predict_anomalies(req: AnomalyRequest):
    try:
        return fraud_model.analyze_event_stream(req.sampleSize)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly detection error: {str(e)}")


@app.post("/predict/crowd")
def predict_crowd(req: CrowdRequest):
    try:
        return crowd_model.predict_sessions(req.sessions or [], req.totalRegistrations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crowd prediction error: {str(e)}")


@app.post("/predict/optimal-price")
def predict_optimal_price(req: DynamicPricingRequest):
    try:
        return pricing_optimizer.optimize_price(req.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dynamic pricing error: {str(e)}")


@app.post("/similarity/match")
def compute_similarity(req: SimilarityRequest):
    """
    Computes token-overlap and substring similarity for proposal-to-checklist task matching.
    """
    tokens1 = [w.strip(".,;:!?()[]") for w in req.text1.lower().split() if len(w) > 2]
    tokens2 = [w.strip(".,;:!?()[]") for w in req.text2.lower().split() if len(w) > 2]

    if not tokens1 or not tokens2:
        return {"similarityScore": 0.0}

    # Match tokens with prefix/stem containment
    matches = 0
    for t1 in tokens1:
        for t2 in tokens2:
            if t1 == t2 or t1.startswith(t2[:4]) or t2.startswith(t1[:4]):
                matches += 1
                break

    total = len(set(tokens1 + tokens2))
    score = round(matches / max(1, total), 3)
    return {"similarityScore": min(1.0, score)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
