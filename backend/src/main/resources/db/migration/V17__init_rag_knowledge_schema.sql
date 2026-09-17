-- =========================================================
-- Flyway Migration V17: RAG Knowledge Base Schema (Milestone 7.2)
-- =========================================================

-- 1. RAG Query Audit Log Table
CREATE TABLE rag_query_logs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
    user_query TEXT NOT NULL,
    generated_answer TEXT NOT NULL,
    chunks_retrieved_count INT NOT NULL DEFAULT 0,
    prompt_tokens_used INT NOT NULL DEFAULT 0,
    completion_tokens_used INT NOT NULL DEFAULT 0,
    execution_time_ms BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36)
);

CREATE INDEX idx_rag_query_logs_tenant ON rag_query_logs(tenant_id, created_at DESC);
