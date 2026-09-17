-- =========================================================
-- Flyway Migration V10: Attendance Engine Schema (Milestone 6.1)
-- =========================================================

-- 1. Attendance Table
CREATE TABLE attendances (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_id VARCHAR(36) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    ticket_id VARCHAR(36) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_in_method VARCHAR(50) NOT NULL DEFAULT 'QR_SCAN', -- QR_SCAN, MANUAL, BULK
    checked_in_by_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CHECKED_IN', -- CHECKED_IN, CHECKED_OUT, CORRECTION_REMOVED
    notes VARCHAR(512),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT uk_tenant_event_ticket_attendance UNIQUE (tenant_id, event_id, ticket_id)
);

CREATE INDEX idx_attendances_tenant_event ON attendances(tenant_id, event_id, status, deleted);
CREATE INDEX idx_attendances_ticket ON attendances(tenant_id, ticket_id);

-- 2. Attendance Logs Table
CREATE TABLE attendance_logs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    attendance_id VARCHAR(36) NOT NULL REFERENCES attendances(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- CHECK_IN, CHECK_OUT, CORRECTION, REJECTED_DUPLICATE
    performed_by_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    details VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attendance_logs_attendance ON attendance_logs(tenant_id, attendance_id);
