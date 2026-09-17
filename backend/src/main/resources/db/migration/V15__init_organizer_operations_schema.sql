-- =========================================================
-- Flyway Migration V15: Organizer Operations Schema (Milestone 6.6)
-- =========================================================

-- 1. Printed Badges Table
CREATE TABLE printed_badges (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_id VARCHAR(36) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL DEFAULT 'ATTENDEE', -- ATTENDEE, SPEAKER, VIP, PRESS, ORGANIZER, VOLUNTEER
    printed_by_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    print_count INT NOT NULL DEFAULT 1,
    last_printed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_printed_badges_registration ON printed_badges(tenant_id, registration_id);

-- 2. Organizer Activity Audit Logs Table
CREATE TABLE organizer_actions (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
    organizer_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action_type VARCHAR(100) NOT NULL, -- WALK_IN_REGISTRATION, TICKET_REISSUE, BADGE_PRINT, EMERGENCY_BROADCAST, LOST_TICKET_RECOVERY
    target_entity_id VARCHAR(36),
    details VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizer_actions_tenant_event ON organizer_actions(tenant_id, event_id, created_at DESC);
