-- =========================================================
-- Flyway Migration V19: AI Analytics Engine Schema (Milestone 7.4)
-- =========================================================

-- 1. AI Analytics Insights Cache Table
CREATE TABLE ai_analytics_insights (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    predicted_attendance_count INT NOT NULL DEFAULT 0,
    predicted_check_in_rate DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    capacity_risk_level VARCHAR(50) NOT NULL DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
    peak_check_in_hour VARCHAR(50),
    anomalies_detected TEXT,
    ai_summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_analytics_tenant_event ON ai_analytics_insights(tenant_id, event_id, created_at DESC);
