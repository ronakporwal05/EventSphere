-- =========================================================
-- Flyway Migration V2: Event, Session, & Venue Schema
-- =========================================================

-- 1. Venues Table
CREATE TABLE venues (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(512),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    capacity INT NOT NULL DEFAULT 0,
    is_virtual BOOLEAN NOT NULL DEFAULT FALSE,
    virtual_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX idx_venues_tenant ON venues(tenant_id);

-- 2. Rooms Table
CREATE TABLE rooms (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    venue_id VARCHAR(36) NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL DEFAULT 0,
    floor_level VARCHAR(50),
    equipment_notes VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX idx_rooms_tenant_venue ON rooms(tenant_id, venue_id);

-- 3. Events Table (9-State Lifecycle)
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    short_description VARCHAR(512),
    description TEXT,
    banner_url VARCHAR(512),
    logo_url VARCHAR(512),
    category VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL DEFAULT 'HYBRID', -- PHYSICAL, VIRTUAL, HYBRID
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, REVIEW, APPROVED, PUBLISHED, REGISTRATION_OPEN, LIVE, COMPLETED, CERTIFICATE_GENERATED, ARCHIVED, CANCELLED
    capacity INT NOT NULL DEFAULT 0,
    registration_start TIMESTAMP WITH TIME ZONE,
    registration_end TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue_id VARCHAR(36) REFERENCES venues(id) ON DELETE SET NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    require_approval BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX idx_events_tenant_status_date ON events(tenant_id, status, start_date);
CREATE INDEX idx_events_slug ON events(slug);

-- 4. Event Custom Fields Table
CREATE TABLE event_custom_fields (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL DEFAULT 'TEXT', -- TEXT, NUMBER, SELECT, CHECKBOX, RADIO
    required BOOLEAN NOT NULL DEFAULT FALSE,
    options_json TEXT, -- JSON string for SELECT/RADIO options
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX idx_custom_fields_event ON event_custom_fields(tenant_id, event_id);

-- 5. Sessions Table
CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    room_id VARCHAR(36) REFERENCES rooms(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX idx_sessions_event_time ON sessions(tenant_id, event_id, start_time);

-- 6. Session Speakers Table
CREATE TABLE session_speakers (
    session_id VARCHAR(36) NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    speaker_role VARCHAR(100) DEFAULT 'PRIMARY_SPEAKER',
    PRIMARY KEY (session_id, user_id)
);
