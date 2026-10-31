"""
EventSphere AI — Synthetic Data Generation Pipeline
Provides statistically calibrated synthetic training datasets modeling event lifecycle operations,
task execution lag, registration velocity curves, and attendee behavioral telemetry.
"""

import numpy as np
import pandas as pd


def generate_event_delay_dataset(n_samples: int = 5000, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates synthetic lifecycle snapshots for training the Event Delay Predictor (Model 1).
    Features:
      - actual_progress: 0 to 100%
      - planned_progress: 0 to 100%
      - progress_gap: actual - planned (-100 to +50)
      - overdue_tasks: 0 to 15
      - blocked_tasks: 0 to 8
      - days_remaining: 1 to 90
      - total_tasks: 5 to 50
      - missing_milestones: 0 to 6
    Target:
      - will_miss_deadline: 0 (On-Time) or 1 (Delayed)
    """
    np.random.seed(random_seed)

    days_remaining = np.random.randint(1, 90, size=n_samples)
    total_tasks = np.random.randint(5, 50, size=n_samples)

    # Planned progress inversely related to days remaining
    planned_progress = np.clip(100.0 - (days_remaining / 90.0 * 85.0) + np.random.normal(0, 5, n_samples), 5.0, 100.0)

    # Progress gap variance
    progress_gap = np.random.normal(-5.0, 15.0, size=n_samples)
    actual_progress = np.clip(planned_progress + progress_gap, 0.0, 100.0)
    progress_gap = actual_progress - planned_progress

    # Tasks lagging
    overdue_tasks = np.random.poisson(lam=np.clip(-progress_gap / 10.0 + 1.0, 0.1, 10.0))
    blocked_tasks = np.random.poisson(lam=np.clip(overdue_tasks * 0.4, 0.05, 5.0))
    missing_milestones = np.random.poisson(lam=np.clip(blocked_tasks * 0.6, 0.0, 4.0))

    # Latent delay risk score with non-linear thresholds
    latent_score = (
        -0.035 * actual_progress
        + 0.025 * planned_progress
        - 0.045 * progress_gap
        + 0.18 * overdue_tasks
        + 0.22 * blocked_tasks
        + 0.15 * missing_milestones
        - 0.02 * days_remaining
        + np.random.normal(0, 0.35, size=n_samples)
    )

    probability = 1.0 / (1.0 + np.exp(-latent_score))
    will_miss_deadline = (probability >= 0.50).astype(int)

    return pd.DataFrame({
        "actual_progress": actual_progress,
        "planned_progress": planned_progress,
        "progress_gap": progress_gap,
        "overdue_tasks": overdue_tasks,
        "blocked_tasks": blocked_tasks,
        "days_remaining": days_remaining,
        "total_tasks": total_tasks,
        "missing_milestones": missing_milestones,
        "will_miss_deadline": will_miss_deadline
    })


def generate_registration_dataset(n_samples: int = 3000, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates synthetic registration velocity and growth data for Model 2.
    """
    np.random.seed(random_seed)

    target_capacity = np.random.choice([200, 350, 500, 1000, 2500], size=n_samples)
    days_remaining = np.random.randint(1, 60, size=n_samples)
    lead_time_days = np.random.randint(30, 90, size=n_samples)
    elapsed_days = np.maximum(1, lead_time_days - days_remaining)

    # Base velocity
    ideal_daily_rate = target_capacity / lead_time_days
    current_velocity = ideal_daily_rate * np.random.uniform(0.4, 1.4, size=n_samples)
    current_registrations = np.minimum(target_capacity, (current_velocity * elapsed_days).astype(int))

    # Final registrations modeled with marketing acceleration near deadline
    surge_factor = np.random.normal(1.15, 0.20, size=n_samples)
    final_registrations = np.clip(
        current_registrations + (current_velocity * days_remaining * surge_factor).astype(int),
        current_registrations,
        (target_capacity * 1.15).astype(int)
    )

    return pd.DataFrame({
        "target_capacity": target_capacity,
        "current_registrations": current_registrations,
        "days_remaining": days_remaining,
        "current_velocity": current_velocity,
        "final_registrations": final_registrations
    })


def generate_noshow_dataset(n_samples: int = 4000, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates attendee telemetry for No-Show modeling (Model 3).
    """
    np.random.seed(random_seed)

    lead_time_days = np.random.exponential(scale=20, size=n_samples) + 1
    past_events_attended = np.random.poisson(lam=1.5, size=n_samples)
    reminder_opened = np.random.binomial(n=1, p=0.68, size=n_samples)
    ticket_price = np.random.choice([0, 499, 999, 1999, 4999], size=n_samples)
    is_vip = (ticket_price >= 1999).astype(int)

    # Free ticket holders have much higher no-show rate
    no_show_logits = (
        0.025 * lead_time_days
        - 0.55 * past_events_attended
        - 0.85 * reminder_opened
        - 0.0004 * ticket_price
        - 0.40 * is_vip
        + np.random.normal(0, 0.4, size=n_samples)
    )

    prob = 1.0 / (1.0 + np.exp(-no_show_logits))
    no_show = (prob >= 0.45).astype(int)

    return pd.DataFrame({
        "lead_time_days": lead_time_days,
        "past_events_attended": past_events_attended,
        "reminder_opened": reminder_opened,
        "ticket_price": ticket_price,
        "is_vip": is_vip,
        "no_show": no_show
    })


def generate_crowd_dataset(n_samples: int = 2500, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates per-session crowd and room capacity telemetry for Model 5.
    """
    np.random.seed(random_seed)

    event_registrations = np.random.randint(150, 3000, size=n_samples)
    room_capacity = np.random.choice([50, 100, 200, 400, 800], size=n_samples)
    is_keynote = np.random.binomial(n=1, p=0.20, size=n_samples)
    speaker_rating = np.clip(np.random.normal(4.3, 0.5, size=n_samples), 2.0, 5.0)
    slot_hour = np.random.choice([9, 11, 14, 16], size=n_samples)

    # Base attendance fraction of total event registrations
    base_fraction = np.where(is_keynote == 1, 0.65, 0.22)
    attendance = (event_registrations * base_fraction * (speaker_rating / 4.0)).astype(int)
    attendance += np.random.normal(0, 15, size=n_samples).astype(int)
    attendance = np.maximum(10, attendance)

    return pd.DataFrame({
        "event_registrations": event_registrations,
        "room_capacity": room_capacity,
        "is_keynote": is_keynote,
        "speaker_rating": speaker_rating,
        "slot_hour": slot_hour,
        "attendance": attendance
    })
