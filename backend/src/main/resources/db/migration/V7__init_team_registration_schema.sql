-- =========================================================
-- Flyway Migration V7: Team Registration Schema (Milestone 5.3)
-- =========================================================

-- 1. Teams Table
CREATE TABLE teams (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    leader_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    min_team_size INT NOT NULL DEFAULT 2,
    max_team_size INT NOT NULL DEFAULT 5,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, DISBANDED
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT uk_tenant_event_teamname UNIQUE (tenant_id, event_id, name)
);

CREATE INDEX idx_teams_tenant_event ON teams(tenant_id, event_id, status, deleted);

-- 2. Team Members Table
CREATE TABLE team_members (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    team_id VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER', -- LEADER, MEMBER
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, REMOVED, LEFT
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_team_user UNIQUE (team_id, user_id)
);

CREATE INDEX idx_team_members ON team_members(tenant_id, team_id, status);

-- 3. Team Invitations Table
CREATE TABLE team_invitations (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    team_id VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    invitee_email VARCHAR(255) NOT NULL,
    invited_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    token VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED, EXPIRED
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_invitations ON team_invitations(tenant_id, team_id, invitee_email);
