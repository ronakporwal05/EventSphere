-- =========================================================
-- Flyway Migration V12: Certificate Engine Schema (Milestone 6.3)
-- =========================================================

-- 1. Certificate Templates Table
CREATE TABLE certificate_templates (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    background_url VARCHAR(512),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT uk_tenant_event_certtemplate UNIQUE (tenant_id, event_id, name)
);

CREATE INDEX idx_cert_templates_event ON certificate_templates(tenant_id, event_id, is_active, deleted);

-- 2. Certificates Table
CREATE TABLE certificates (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_id VARCHAR(36) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    template_id VARCHAR(36) NOT NULL REFERENCES certificate_templates(id) ON DELETE RESTRICT,
    certificate_number VARCHAR(100) NOT NULL UNIQUE,
    verification_token VARCHAR(255) NOT NULL UNIQUE,
    issued_to_name VARCHAR(255) NOT NULL,
    issued_to_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ISSUED', -- GENERATING, ISSUED, REVOKED, REISSUED
    pdf_url VARCHAR(512),
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX idx_certificates_tenant_event ON certificates(tenant_id, event_id, status, deleted);
CREATE INDEX idx_certificates_verification ON certificates(verification_token);
