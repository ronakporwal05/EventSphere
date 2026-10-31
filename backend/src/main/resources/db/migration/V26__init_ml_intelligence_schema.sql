-- =========================================================
-- Flyway Migration V26: ML Predictive Intelligence Schema
-- =========================================================

-- 1. Alter event_tasks to add ML Progress weights and blocking attributes
ALTER TABLE event_tasks 
    ADD COLUMN IF NOT EXISTS weight DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    ADD COLUMN IF NOT EXISTS completion_fraction DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS blocked_reason VARCHAR(512);

-- 2. Event Proposals Table
CREATE TABLE IF NOT EXISTS event_proposals (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    raw_content TEXT,
    summary TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_REVIEW', -- PENDING_REVIEW, APPROVED, REJECTED
    reviewed_by VARCHAR(36),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_proposals_tenant_event ON event_proposals(tenant_id, event_id, deleted);

-- 3. Proposal Milestones Table
CREATE TABLE IF NOT EXISTS proposal_milestones (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    proposal_id VARCHAR(36) NOT NULL REFERENCES event_proposals(id) ON DELETE CASCADE,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deliverables TEXT,
    dependencies TEXT,
    target_date TIMESTAMP WITH TIME ZONE,
    weight DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    matched_task_id VARCHAR(36) REFERENCES event_tasks(id) ON DELETE SET NULL,
    similarity_score DOUBLE PRECISION DEFAULT 0.0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_milestones_proposal ON proposal_milestones(tenant_id, proposal_id, approved);
CREATE INDEX IF NOT EXISTS idx_milestones_event ON proposal_milestones(tenant_id, event_id);

-- 4. Event Intelligence Snapshots (Historical ML Audit & Progress)
CREATE TABLE IF NOT EXISTS event_intelligence_snapshots (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    actual_progress DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    planned_progress DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    progress_gap DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    delay_risk_score DOUBLE PRECISION DEFAULT 0.0,
    delay_risk_level VARCHAR(50) DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
    predicted_registrations INT DEFAULT 0,
    expected_no_show_rate DOUBLE PRECISION DEFAULT 0.0,
    anomaly_flags_count INT DEFAULT 0,
    snapshot_data TEXT, -- JSON containing SHAP details, crowd forecasts, recommendations
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_intelligence_event ON event_intelligence_snapshots(tenant_id, event_id, created_at);
