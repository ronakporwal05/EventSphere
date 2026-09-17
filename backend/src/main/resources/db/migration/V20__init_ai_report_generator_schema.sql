-- =========================================================
-- Flyway Migration V20: AI Report Generator Schema (Milestone 7.5)
-- =========================================================

-- 1. AI Generated Reports Table
CREATE TABLE ai_reports (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL, -- POST_EVENT_SUMMARY, OPERATIONS_PERFORMANCE, EXECUTIVE_BRIEFING
    title VARCHAR(255) NOT NULL,
    markdown_content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED', -- GENERATING, COMPLETED, FAILED
    error_message VARCHAR(512),
    generated_by_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_reports_tenant_event ON ai_reports(tenant_id, event_id, deleted);
