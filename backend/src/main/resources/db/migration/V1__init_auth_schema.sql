-- =========================================================
-- Flyway Migration V1: Core Authentication & Multi-Tenancy Schema
-- =========================================================

-- 1. Tenants Table
CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(512),
    contact_email VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'FREE',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_slug ON tenants(slug);

-- 2. Users Table (Global Identity)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    avatar_url VARCHAR(512),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lock_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- 3. Roles Table (System & Custom Roles)
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_system_role BOOLEAN NOT NULL DEFAULT TRUE,
    tenant_id VARCHAR(36) REFERENCES tenants(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Permissions Table
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    CONSTRAINT uk_resource_action UNIQUE (resource, action)
);

-- 5. Role-Permissions Join Table
CREATE TABLE role_permissions (
    role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(36) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 6. Tenant Memberships (Maps User to Tenant with Role)
CREATE TABLE tenant_memberships (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    department VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_user UNIQUE (tenant_id, user_id)
);

CREATE INDEX idx_tm_tenant_user ON tenant_memberships(tenant_id, user_id);

-- 7. Refresh Tokens Table
CREATE TABLE refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_info VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    replaced_by VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_token_user ON refresh_tokens(user_id);

-- 8. Login History Table
CREATE TABLE login_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    email_attempted VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(512),
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_login_user_time ON login_history(user_id, attempted_at DESC);

-- =========================================================
-- SEED DATA: Default System Roles & Initial Permissions
-- =========================================================

INSERT INTO roles (id, name, description, is_system_role) VALUES
('role_super_admin', 'SUPER_ADMIN', 'Platform Administrator with full access across all tenants', TRUE),
('role_org_admin', 'ORGANIZATION_ADMIN', 'Organization Administrator with full access to tenant data', TRUE),
('role_event_manager', 'EVENT_MANAGER', 'Event Manager allowed to create and manage events', TRUE),
('role_volunteer', 'VOLUNTEER', 'Volunteer with ticket scanning and check-in access', TRUE),
('role_speaker', 'SPEAKER', 'Event Speaker with presentation material management access', TRUE),
('role_sponsor', 'SPONSOR', 'Sponsor representative with access to leads and analytics', TRUE),
('role_vendor', 'VENDOR', 'Exhibition vendor with booth access and lead collection', TRUE),
('role_judge', 'JUDGE', 'Event Judge for hackathons and competitions', TRUE),
('role_attendee', 'ATTENDEE', 'Standard Event Attendee', TRUE);
