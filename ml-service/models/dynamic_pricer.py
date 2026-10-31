"""
Dynamic Pricing & Revenue Yield Optimization Engine
Uses demand price elasticity, registration velocity, and time-decay to find optimal ticket price.
Maximizes total expected gross revenue subject to capacity and anti-gouging bounds.
"""

from typing import Dict, Any, List
import numpy as np


class DynamicPricingOptimizer:
    def __init__(self):
        # Base elasticity coefficient for enterprise & tech summits (-0.82 is typical)
        self.base_elasticity = -0.82

    def optimize_price(self, params: Dict[str, Any]) -> Dict[str, Any]:
        current_price = float(params.get("currentPrice", 1499.0))
        target_capacity = max(10, int(params.get("targetCapacity", 1000)))
        current_sales = max(0, int(params.get("currentSales", 250)))
        days_remaining = max(1, int(params.get("daysRemaining", 14)))
        daily_velocity = float(params.get("dailyVelocity", 12.0))
        category = params.get("category", "Technology & AI")

        # Baseline expected velocity
        remaining_capacity = max(1, target_capacity - current_sales)
        baseline_velocity = remaining_capacity / max(1.0, float(days_remaining))

        # Demand surge factor (ratio of actual velocity to baseline need)
        surge_factor = round(max(0.2, min(4.0, daily_velocity / max(0.5, baseline_velocity))), 2)

        # Dynamic elasticity adjusted for urgency & surge:
        # Closer to event -> lower sensitivity (inelastic); higher surge -> lower sensitivity
        urgency_factor = max(0.0, (30.0 - min(30, days_remaining)) / 30.0)
        calibrated_elasticity = round(self.base_elasticity * (1.0 - 0.25 * urgency_factor) / max(0.6, surge_factor ** 0.3), 3)

        # Allowable price bounds (+35% surge ceiling, -25% stimulation floor)
        price_floor = round(max(99.0, current_price * 0.75), 0)
        price_ceiling = round(current_price * 1.35, 0)

        # Simulate price spectrum (15 discrete price steps)
        test_prices = np.linspace(price_floor, price_ceiling, 15)
        simulated_curve: List[Dict[str, Any]] = []

        best_price = current_price
        max_projected_revenue = 0.0
        best_sales = current_sales

        for p in test_prices:
            p_val = round(float(p), 0)
            # Round to clean ending (e.g. 49, 99 or multiple of 50)
            p_clean = round(p_val / 50.0) * 50.0 - 1.0 if p_val > 200 else p_val

            # Quantity response based on price elasticity:
            # % Delta Q = elasticity * % Delta P
            price_ratio = p_clean / max(1.0, current_price)
            demand_multiplier = (price_ratio ** calibrated_elasticity) * (surge_factor ** 0.4)

            projected_additional_sales = max(0, int(daily_velocity * days_remaining * demand_multiplier))
            projected_total_sales = min(target_capacity, current_sales + projected_additional_sales)

            # Gross revenue = already collected revenue + future ticket revenue
            future_revenue = (projected_total_sales - current_sales) * p_clean
            gross_revenue = (current_sales * current_price) + future_revenue

            sellout_prob = min(0.99, max(0.1, projected_total_sales / float(target_capacity)))

            simulated_curve.append({
                "price": round(p_clean, 2),
                "projectedSales": int(projected_total_sales),
                "projectedRevenue": round(gross_revenue, 2),
                "selloutProbability": round(float(sellout_prob), 3)
            })

            if gross_revenue > max_projected_revenue:
                max_projected_revenue = gross_revenue
                best_price = p_clean
                best_sales = projected_total_sales

        # Current projected revenue without price change
        current_demand_mult = surge_factor ** 0.4
        current_add_sales = max(0, int(daily_velocity * days_remaining * current_demand_mult))
        current_projected_sales = min(target_capacity, current_sales + current_add_sales)
        current_gross_revenue = (current_sales * current_price) + ((current_projected_sales - current_sales) * current_price)

        projected_additional_rev = max(0.0, max_projected_revenue - current_gross_revenue)
        price_diff_pct = round(((best_price - current_price) / max(1.0, current_price)) * 100.0, 1)

        # Action determination
        if price_diff_pct >= 5.0:
            action = "SURGE_INCREASE"
            rationale = f"Sales velocity is {surge_factor}x baseline. Raising price to ₹{int(best_price):,} captures surge willingness-to-pay while maintaining {round(best_sales/target_capacity*100, 1)}% target sellout."
        elif price_diff_pct <= -5.0:
            action = "DISCOUNT_STIMULATE"
            rationale = f"Sales velocity is lagging target pace with {days_remaining} days left. Stimulating demand at ₹{int(best_price):,} lifts sales velocity by {abs(price_diff_pct)}%."
        else:
            action = "HOLD_CURRENT"
            rationale = f"Current price of ₹{int(current_price):,} is near optimal yield equilibrium. No price adjustment recommended."

        return {
            "eventId": params.get("eventId", "evt-global-2026"),
            "currentPrice": current_price,
            "optimalPrice": round(best_price, 2),
            "priceDifferencePct": price_diff_pct,
            "recommendedAction": action,
            "rationale": rationale,
            "projectedGrossRevenue": round(max_projected_revenue, 2),
            "currentProjectedRevenue": round(current_gross_revenue, 2),
            "projectedRevenueUplift": round(projected_additional_rev, 2),
            "expectedTotalSales": int(best_sales),
            "targetCapacity": target_capacity,
            "elasticityCoefficient": calibrated_elasticity,
            "demandSurgeFactor": surge_factor,
            "priceFloor": price_floor,
            "priceCeiling": price_ceiling,
            "simulationCurve": simulated_curve,
            "algorithm": "Elasticity-Constrained Revenue Maximization (Log-Log Yield Model)"
        }
