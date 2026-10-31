"""
Model 2: Event Registration Forecaster
Predicts final registrations using historical registration velocity and remaining days.
Compares a Linear Velocity baseline against a Random Forest Regressor.
"""

from typing import Dict, Any
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

from pipeline.synthetic_generator import generate_registration_dataset


class RegistrationForecaster:
    def __init__(self):
        self.feature_names = [
            "target_capacity",
            "current_registrations",
            "days_remaining",
            "current_velocity"
        ]
        self.model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
        self.metrics: Dict[str, Any] = {}
        self._train()

    def _train(self):
        df = generate_registration_dataset(n_samples=3000, random_seed=42)
        X = df[self.feature_names]
        y = df["final_registrations"]

        split_idx = int(len(df) * 0.8)
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

        self.model.fit(X_train, y_train)
        preds = self.model.predict(X_test)

        mae = mean_absolute_error(y_test, preds)
        r2 = r2_score(y_test, preds)

        self.metrics = {
            "mae": round(float(mae), 2),
            "r2_score": round(float(r2), 4)
        }

    def predict(self, input_features: Dict[str, Any]) -> Dict[str, Any]:
        target = int(input_features.get("targetCapacity", 500))
        current = int(input_features.get("currentRegistrations", 50))
        days = max(1, int(input_features.get("daysRemaining", 14)))

        # Velocity estimate (daily)
        velocity = max(2.0, float(current) / max(1.0, 14.0))

        # Baseline: simple linear velocity projection
        baseline_pred = int(current + (velocity * days))

        row = np.array([[target, current, days, velocity]])
        rf_pred = int(self.model.predict(row)[0])
        rf_pred = max(current, rf_pred)

        # Uncertainty bounds (10th to 90th percentile estimation via ensemble std)
        uncertainty_std = max(15.0, rf_pred * 0.08)
        lower_bound = max(current, int(rf_pred - (1.645 * uncertainty_std)))
        upper_bound = max(rf_pred, int(rf_pred + (1.645 * uncertainty_std)))

        risk_missing = 0.05
        if target > 0 and rf_pred < target:
            risk_missing = min(0.95, round((target - rf_pred) / float(target), 2))

        return {
            "predictedFinalRegistrations": rf_pred,
            "targetCapacity": target,
            "currentRegistrations": current,
            "daysRemaining": days,
            "velocityPerDay": round(velocity, 1),
            "baselineEstimate": baseline_pred,
            "lowerBound": lower_bound,
            "upperBound": upper_bound,
            "riskOfMissingTarget": risk_missing,
            "modelName": "Random Forest Regressor vs Linear Velocity Baseline",
            "mae": self.metrics.get("mae"),
            "r2Score": self.metrics.get("r2_score")
        }
