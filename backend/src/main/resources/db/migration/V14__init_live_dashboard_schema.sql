-- =========================================================
-- Flyway Migration V14: Live Operations Dashboard Schema (Milestone 6.5)
-- =========================================================

CREATE TABLE dashboard_snapshots (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    live_registration_count INT NOT NULL DEFAULT 0,
    live_attendance_count INT NOT NULL DEFAULT 0,
    remaining_capacity INT NOT NULL DEFAULT 0,
    active_volunteers_count INT NOT NULL DEFAULT 0,
    pending_certificates_count INT NOT NULL DEFAULT 0,
    pending_notifications_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dashboard_snapshots_tenant_event ON dashboard_snapshots(tenant_id, event_id, created_at DESC);
