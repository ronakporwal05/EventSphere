-- =========================================================
-- Flyway Migration V24: Unified Search Platform Schema (Milestone 7.9)
-- =========================================================

-- 1. Search Query Audit Log Table
CREATE TABLE search_query_logs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    query_text VARCHAR(255) NOT NULL,
    entity_filter VARCHAR(50) NOT NULL DEFAULT 'ALL',
    results_found_count INT NOT NULL DEFAULT 0,
    execution_time_ms BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_query_logs_tenant ON search_query_logs(tenant_id, created_at DESC);
