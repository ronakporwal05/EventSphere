-- =========================================================
-- Flyway Migration V5: Registration Engine Schema (Milestone 5.1)
-- =========================================================

CREATE TABLE registrations (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    attendee_name VARCHAR(255) NOT NULL,
    attendee_email VARCHAR(255) NOT NULL,
    attendee_phone VARCHAR(50),
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELLED, REJECTED, WAITLISTED
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancellation_reason VARCHAR(512),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT uk_tenant_event_email UNIQUE (tenant_id, event_id, attendee_email)
);

CREATE INDEX idx_registrations_tenant_event ON registrations(tenant_id, event_id, status, deleted);
CREATE INDEX idx_registrations_email ON registrations(tenant_id, attendee_email);
