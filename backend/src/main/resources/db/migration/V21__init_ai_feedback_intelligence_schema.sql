-- =========================================================
-- Flyway Migration V21: AI Feedback Intelligence Schema (Milestone 7.6)
-- =========================================================

-- 1. Attendee Feedback Submissions Table
CREATE TABLE event_feedback (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_id VARCHAR(36) REFERENCES registrations(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- GENERAL, VENUE, SPEAKERS, FOOD, ORGANIZING
    comment TEXT NOT NULL,
    sentiment VARCHAR(50) NOT NULL DEFAULT 'NEUTRAL', -- POSITIVE, NEUTRAL, NEGATIVE
    emotion VARCHAR(50), -- DELIGHTED, SATISFIED, CONFUSED, FRUSTRATED, ANGRY
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_feedback_tenant_event ON event_feedback(tenant_id, event_id, sentiment);

-- 2. Feedback Sentiment Aggregated Summaries Table
CREATE TABLE feedback_sentiment_summaries (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    total_feedback_count INT NOT NULL DEFAULT 0,
    average_rating DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    positive_count INT NOT NULL DEFAULT 0,
    neutral_count INT NOT NULL DEFAULT 0,
    negative_count INT NOT NULL DEFAULT 0,
    top_themes TEXT,
    action_items TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_summary_tenant_event ON feedback_sentiment_summaries(tenant_id, event_id, created_at DESC);
