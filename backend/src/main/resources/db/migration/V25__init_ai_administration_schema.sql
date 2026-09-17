-- =========================================================
-- Flyway Migration V25: AI Administration Schema (Milestone 7.10)
-- =========================================================

-- 1. AI Model Configurations Table
CREATE TABLE ai_model_configs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    llm_provider VARCHAR(50) NOT NULL DEFAULT 'GEMINI_1_5_PRO',
    embedding_provider VARCHAR(50) NOT NULL DEFAULT 'GEMINI_EMBEDDING_004',
    temperature DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    top_p DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    max_output_tokens INT NOT NULL DEFAULT 2048,
    daily_token_quota INT NOT NULL DEFAULT 500000,
    monthly_token_quota INT NOT NULL DEFAULT 15000000,
    feature_rag_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    feature_assistant_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    feature_analytics_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    feature_content_studio_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_ai_model_config_tenant UNIQUE (tenant_id)
);

-- 2. AI Token Usage & Cost Log Table
CREATE TABLE ai_token_usage_logs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    module_name VARCHAR(50) NOT NULL, -- DOC_INTEL, RAG, ASSISTANT, ANALYTICS, REPORTS, CONTENT_STUDIO
    prompt_tokens INT NOT NULL DEFAULT 0,
    completion_tokens INT NOT NULL DEFAULT 0,
    total_tokens INT NOT NULL DEFAULT 0,
    estimated_cost_usd DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_token_usage_tenant ON ai_token_usage_logs(tenant_id, created_at DESC);
