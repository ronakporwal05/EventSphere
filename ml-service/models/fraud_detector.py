"""
Model 4: Ticket Fraud & Anomaly Detector
Applies Isolation Forest to detect abnormal registration velocity, card failure bursts, and coupon abuse.
Flags suspicious activity for organizer audit without interfering with core payment/crypto verification.
"""

from typing import Dict, Any, List
import numpy as np
from sklearn.ensemble import IsolationForest


class FraudAnomalyDetector:
    def __init__(self):
        # Feature columns: [velocity_per_min, failed_attempts_window, coupon_count_window, ip_entropy]
        self.model = IsolationForest(contamination=0.05, random_state=42)
        self._train()

    def _train(self):
        np.random.seed(42)
        # Normal behavior (95%)
        normal_velocity = np.random.poisson(lam=2, size=2000)
        normal_fails = np.random.poisson(lam=0.2, size=2000)
        normal_coupons = np.random.poisson(lam=0.5, size=2000)
        normal_entropy = np.random.normal(loc=1.2, scale=0.3, size=2000)

        # Anomalous behavior (5%)
        burst_velocity = np.random.randint(10, 45, size=100)
        burst_fails = np.random.randint(3, 12, size=100)
        burst_coupons = np.random.randint(5, 20, size=100)
        burst_entropy = np.random.uniform(3.0, 6.0, size=100)

        velocities = np.concatenate([normal_velocity, burst_velocity])
        fails = np.concatenate([normal_fails, burst_fails])
        coupons = np.concatenate([normal_coupons, burst_coupons])
        entropies = np.concatenate([normal_entropy, burst_entropy])

        X = np.column_stack([velocities, fails, coupons, entropies])
        self.model.fit(X)

    def analyze_event_stream(self, sample_size: int = 50) -> Dict[str, Any]:
        """
        Evaluates a simulated telemetry window for the event.
        """
        n = max(30, sample_size)
        velocities = np.random.poisson(lam=2, size=n)
        fails = np.random.poisson(lam=0.3, size=n)
        coupons = np.random.poisson(lam=0.4, size=n)
        entropies = np.random.normal(1.2, 0.2, size=n)

        # Inject 2 realistic anomalous events for demonstration
        velocities[3] = 28
        fails[3] = 5
        coupons[3] = 8

        velocities[12] = 18
        coupons[12] = 11

        X = np.column_stack([velocities, fails, coupons, entropies])
        preds = self.model.predict(X)  # -1 for anomaly, 1 for normal
        scores = self.model.decision_function(X)

        flagged_events: List[Dict[str, Any]] = []
        for i in range(len(preds)):
            if preds[i] == -1:
                flagged_events.append({
                    "timestampOffset": f"T-{n - i}m",
                    "anomalyScore": round(float(abs(scores[i])), 3),
                    "type": "RAPID_REGISTRATION_BURST" if velocities[i] > 20 else "COUPON_INJECTION_SPIKE",
                    "details": f"{velocities[i]} registrations / {fails[i]} card retries / {coupons[i]} coupon attempts",
                    "action": "Flag for organizer ID check; pass issued under hold audit"
                })

        return {
            "totalTransactionsAnalyzed": n,
            "flaggedAnomaliesCount": len(flagged_events),
            "overallAnomalyRate": round(float(len(flagged_events) / n * 100), 1),
            "flaggedEvents": flagged_events,
            "modelName": "Isolation Forest (Contamination=0.05, Scikit-Learn)",
            "isolationForestBaseline": "Decision threshold: 0.00 (values < 0 indicate structural outliers)"
        }
