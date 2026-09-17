-- =========================================================
-- Flyway Migration V22: AI Content Studio Schema (Milestone 7.7)
-- =========================================================

-- 1. Generated Content Assets Table
CREATE TABLE generated_content_assets (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- MARKETING_COPY, SOCIAL_POST, SPEAKER_BIO, SESSION_DESC
    platform VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- LINKEDIN, TWITTER, INSTAGRAM, EMAIL, LANDING_PAGE
    tone VARCHAR(50) NOT NULL DEFAULT 'PROFESSIONAL', -- PROFESSIONAL, ENERGETIC, EXECUTIVE, CASUAL
    title VARCHAR(255) NOT NULL,
    generated_text TEXT NOT NULL,
    created_by_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_assets_tenant_event ON generated_content_assets(tenant_id, event_id, content_type);
