-- =========================================================
-- Flyway Migration V9: Waitlist & Capacity Management Schema (Milestone 5.6)
-- =========================================================

CREATE TABLE waitlist_entries (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_id VARCHAR(36) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    position INT NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'WAITING', -- WAITING, PROMOTED, EXPIRED, CANCELLED
    promoted_at TIMESTAMP WITH TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT uk_tenant_event_reg_waitlist UNIQUE (tenant_id, event_id, registration_id)
);

CREATE INDEX idx_waitlist_tenant_event ON waitlist_entries(tenant_id, event_id, status, position);
