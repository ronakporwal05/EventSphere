"""
Automated Unit & Integration Tests for EventSphere ML Predictive Intelligence Engine
"""

import pytest
from fastapi.testclient import TestClient

from pipeline.synthetic_generator import (
    generate_event_delay_dataset,
    generate_registration_dataset,
    generate_noshow_dataset,
    generate_crowd_dataset
)
from models.delay_predictor import DelayPredictor
from models.registration_forecaster import RegistrationForecaster
from models.noshow_predictor import NoShowPredictor
from models.fraud_detector import FraudAnomalyDetector
from models.crowd_predictor import SessionCrowdPredictor
from models.dynamic_pricer import DynamicPricingOptimizer
from main import app

client = TestClient(app)


def test_synthetic_data_generation():
    df_delay = generate_event_delay_dataset(n_samples=50)
    assert len(df_delay) == 50
    assert "actual_progress" in df_delay.columns
    assert "will_miss_deadline" in df_delay.columns

    df_reg = generate_registration_dataset(n_samples=50)
    assert len(df_reg) == 50
    assert "final_registrations" in df_reg.columns

    df_noshow = generate_noshow_dataset(n_samples=50)
    assert len(df_noshow) == 50
    assert "no_show" in df_noshow.columns

    df_crowd = generate_crowd_dataset(n_samples=50)
    assert len(df_crowd) == 50
    assert "attendance" in df_crowd.columns


def test_model_1_delay_predictor():
    predictor = DelayPredictor()
    res = predictor.predict({
        "actualProgress": 35.0,
        "plannedProgress": 65.0,
        "progressGap": -30.0,
        "overdueTasks": 4,
        "blockedTasks": 2,
        "daysRemaining": 5,
        "totalTasks": 20,
        "missingMilestones": 3
    })

    assert 0.0 <= res["delayProbability"] <= 1.0
    assert res["riskLevel"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert len(res["riskFactors"]) > 0
    assert len(res["correctiveActions"]) > 0
    assert res["willMissDeadline"] is True


def test_model_2_registration_forecaster():
    forecaster = RegistrationForecaster()
    res = forecaster.predict({
        "targetCapacity": 500,
        "currentRegistrations": 250,
        "daysRemaining": 10
    })

    assert res["predictedFinalRegistrations"] >= 250
    assert res["lowerBound"] <= res["predictedFinalRegistrations"]
    assert res["upperBound"] >= res["predictedFinalRegistrations"]
    assert 0.0 <= res["riskOfMissingTarget"] <= 1.0


def test_model_3_noshow_predictor():
    predictor = NoShowPredictor()
    res = predictor.predict_cohort(total_registrations=100)

    assert res["totalRegistrations"] == 100
    assert res["expectedAttendees"] + res["expectedNoShows"] == 100
    breakdown = res["riskBreakdown"]
    assert breakdown["LOW_RISK"] + breakdown["MEDIUM_RISK"] + breakdown["HIGH_RISK"] == 100


def test_model_4_fraud_detector():
    detector = FraudAnomalyDetector()
    res = detector.analyze_event_stream(sample_size=40)

    assert res["totalTransactionsAnalyzed"] == 40
    assert res["flaggedAnomaliesCount"] >= 0
    assert "Isolation Forest" in res["modelName"]


def test_model_5_crowd_predictor():
    predictor = SessionCrowdPredictor()
    sessions = [
        {"sessionId": "s-1", "title": "Mega Keynote", "roomCapacity": 200, "isKeynote": True, "speakerRating": 4.9, "slotHour": 10},
        {"sessionId": "s-2", "title": "Niche Workshop", "roomCapacity": 50, "isKeynote": False, "speakerRating": 4.2, "slotHour": 14}
    ]
    res = predictor.predict_sessions(sessions, total_registrations=500)

    assert res["totalSessionsTracked"] == 2
    assert len(res["sessionForecasts"]) == 2
    for s in res["sessionForecasts"]:
        assert s["predictedCrowd"] > 0


def test_model_6_dynamic_pricer():
    optimizer = DynamicPricingOptimizer()
    res = optimizer.optimize_price({
        "eventId": "evt-global-2026",
        "currentPrice": 1499.0,
        "targetCapacity": 5000,
        "currentSales": 1200,
        "daysRemaining": 10,
        "dailyVelocity": 45.0,
        "category": "Technology & AI"
    })

    assert res["optimalPrice"] > 0
    assert res["recommendedAction"] in ["SURGE_INCREASE", "DISCOUNT_STIMULATE", "HOLD_CURRENT"]
    assert len(res["simulationCurve"]) > 0
    assert res["projectedGrossRevenue"] > 0
    assert "Elasticity" in res["algorithm"]


def test_fastapi_endpoints():
    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "HEALTHY"

    res_pricing = client.post("/predict/optimal-price", json={
        "eventId": "evt-global-2026",
        "currentPrice": 1499.0,
        "targetCapacity": 5000,
        "currentSales": 1200,
        "daysRemaining": 10,
        "dailyVelocity": 45.0
    })
    assert res_pricing.status_code == 200
    assert res_pricing.json()["optimalPrice"] > 0
    assert len(res_pricing.json()["simulationCurve"]) == 15

    res_delay = client.post("/predict/delay", json={
        "eventId": "test-event-1",
        "actualProgress": 80.0,
        "plannedProgress": 75.0,
        "progressGap": 5.0,
        "totalTasks": 15,
        "overdueTasks": 0,
        "blockedTasks": 0,
        "missingMilestones": 0,
        "daysRemaining": 12
    })
    assert res_delay.status_code == 200
    assert res_delay.json()["riskLevel"] == "LOW"

    res_sim = client.post("/similarity/match", json={
        "text1": "Finalize venue acoustic and staging",
        "text2": "Venue acoustics and stage rigging setup"
    })
    assert res_sim.status_code == 200
    assert res_sim.json()["similarityScore"] > 0.3
