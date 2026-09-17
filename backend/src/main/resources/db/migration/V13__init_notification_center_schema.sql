-- =========================================================
-- Flyway Migration V13: Notification Center Schema (Milestone 6.4)
-- =========================================================

-- 1. Notification Templates Table
CREATE TABLE notification_templates (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL, -- REGISTRATION_CONFIRMATION, REMINDER, CERTIFICATE_READY, BROADCAST, EMERGENCY
    subject VARCHAR(255) NOT NULL,
    body_template TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT uk_tenant_template_code UNIQUE (tenant_id, code)
);

-- 2. Notifications Table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'EMAIL', -- EMAIL, PUSH, BROADCAST, EMERGENCY
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, SENT, FAILED, RETRYING
    retry_count INT NOT NULL DEFAULT 0,
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_tenant_status ON notifications(tenant_id, status);

-- 3. Email Logs Table
CREATE TABLE email_logs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    notification_id VARCHAR(36) NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL DEFAULT 'DEFAULT_MOCK',
    recipient_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- DELIVERED, FAILED
    response_payload VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Announcements Table
CREATE TABLE announcements (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL', -- GENERAL, REMINDER, URGENT, EMERGENCY
    posted_by_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_announcements_tenant_event ON announcements(tenant_id, event_id, deleted);
