-- =========================================================
-- Flyway Migration V6: Dynamic Registration Form Builder Schema (Milestone 5.2)
-- =========================================================

-- 1. Registration Forms Table
CREATE TABLE registration_forms (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    version INT NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT uk_tenant_event_form_ver UNIQUE (tenant_id, event_id, version)
);

CREATE INDEX idx_forms_tenant_event ON registration_forms(tenant_id, event_id, is_published, deleted);

-- 2. Form Sections Table
CREATE TABLE form_sections (
    id VARCHAR(36) PRIMARY KEY,
    form_id VARCHAR(36) NOT NULL REFERENCES registration_forms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(512),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sections_form ON form_sections(form_id, display_order);

-- 3. Form Fields Table
CREATE TABLE form_fields (
    id VARCHAR(36) PRIMARY KEY,
    section_id VARCHAR(36) NOT NULL REFERENCES form_sections(id) ON DELETE CASCADE,
    field_name VARCHAR(150) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL, -- TEXT, TEXTAREA, EMAIL, PHONE, NUMBER, DROPDOWN, RADIO, CHECKBOX, DATE, TIME, URL, LINKEDIN, GITHUB, FILE_UPLOAD
    placeholder VARCHAR(255),
    help_text VARCHAR(512),
    default_value VARCHAR(255),
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    regex_pattern VARCHAR(255),
    min_length INT,
    max_length INT,
    min_value DECIMAL(12, 2),
    max_value DECIMAL(12, 2),
    conditional_parent_field_id VARCHAR(36),
    conditional_parent_value VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fields_section ON form_fields(section_id, display_order);

-- 4. Field Options Table (for DROPDOWN, RADIO, CHECKBOX)
CREATE TABLE field_options (
    id VARCHAR(36) PRIMARY KEY,
    field_id VARCHAR(36) NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
    option_label VARCHAR(255) NOT NULL,
    option_value VARCHAR(255) NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_options_field ON field_options(field_id, display_order);

-- 5. Form Responses Table
CREATE TABLE form_responses (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    form_id VARCHAR(36) NOT NULL REFERENCES registration_forms(id) ON DELETE RESTRICT,
    registration_id VARCHAR(36) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_responses_registration ON form_responses(tenant_id, registration_id);

-- 6. Form Answers Table
CREATE TABLE form_answers (
    id VARCHAR(36) PRIMARY KEY,
    response_id VARCHAR(36) NOT NULL REFERENCES form_responses(id) ON DELETE CASCADE,
    field_id VARCHAR(36) NOT NULL REFERENCES form_fields(id) ON DELETE RESTRICT,
    answer_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answers_response ON form_answers(response_id, field_id);
