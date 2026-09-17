-- =========================================================
-- Flyway Migration V11: Volunteer Operations Schema (Milestone 6.2)
-- =========================================================

-- 1. Volunteers Table
CREATE TABLE volunteers (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_role VARCHAR(50) NOT NULL DEFAULT 'SCANNER', -- SCANNER, INFO_DESK, LOGISTICS, VIP_ESCORT
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    scanner_mode_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT uk_tenant_event_volunteer UNIQUE (tenant_id, event_id, user_id)
);

CREATE INDEX idx_volunteers_tenant_event ON volunteers(tenant_id, event_id, status, deleted);

-- 2. Volunteer Shifts Table
CREATE TABLE volunteer_shifts (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    volunteer_id VARCHAR(36) NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    shift_name VARCHAR(100) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED', -- ASSIGNED, COMPLETED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_volunteer_shifts_volunteer ON volunteer_shifts(tenant_id, volunteer_id, start_time, end_time);

-- 3. Volunteer Tasks Table
CREATE TABLE volunteer_tasks (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    volunteer_id VARCHAR(36) NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(512),
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_volunteer_tasks_volunteer ON volunteer_tasks(tenant_id, volunteer_id, status);

-- 4. Volunteer Attendance Table
CREATE TABLE volunteer_attendances (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    volunteer_id VARCHAR(36) NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    shift_id VARCHAR(36) NOT NULL REFERENCES volunteer_shifts(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'ON_DUTY', -- ON_DUTY, OFF_DUTY
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Volunteer Performance Table
CREATE TABLE volunteer_performance (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    volunteer_id VARCHAR(36) NOT NULL UNIQUE REFERENCES volunteers(id) ON DELETE CASCADE,
    total_scans_performed INT NOT NULL DEFAULT 0,
    tasks_completed INT NOT NULL DEFAULT 0,
    rating DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
    notes VARCHAR(512),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
