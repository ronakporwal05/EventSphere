-- =========================================================
-- Flyway Migration V23: Recommendation Engine Schema (Milestone 7.8)
-- =========================================================

-- 1. Recommendation Cache Table
CREATE TABLE user_recommendations (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- EVENT, SESSION, NETWORKING
    target_id VARCHAR(36) NOT NULL, -- Event ID, Session ID, or User ID
    match_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    recommendation_reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_tenant_user ON user_recommendations(tenant_id, user_id, recommendation_type);
