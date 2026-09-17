-- =========================================================
-- Flyway Migration V18: AI Event Assistant Schema (Milestone 7.3)
-- =========================================================

-- 1. AI Conversations Table
CREATE TABLE ai_conversations (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'AI Event Assistant Chat',
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_conv_tenant_user ON ai_conversations(tenant_id, user_id, deleted);

-- 2. AI Messages Table
CREATE TABLE ai_messages (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    conversation_id VARCHAR(36) NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_role VARCHAR(50) NOT NULL, -- USER, ASSISTANT, SYSTEM
    content TEXT NOT NULL,
    intent_detected VARCHAR(100), -- SCHEDULE, SPEAKER, ATTENDANCE, GENERAL
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_messages_conv ON ai_messages(conversation_id, created_at ASC);
