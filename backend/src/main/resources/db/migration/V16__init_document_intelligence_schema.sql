-- =========================================================
-- Flyway Migration V16: Document Intelligence Schema (Milestone 7.1)
-- =========================================================

-- 1. Document Processing Jobs Table
CREATE TABLE document_processing_jobs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- PDF, DOCX, TXT, MD
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'QUEUED', -- QUEUED, PROCESSING, COMPLETED, FAILED
    total_chunks INT NOT NULL DEFAULT 0,
    error_message VARCHAR(512),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36)
);

CREATE INDEX idx_doc_jobs_tenant ON document_processing_jobs(tenant_id, status);

-- 2. Document Chunks Table
CREATE TABLE document_chunks (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    job_id VARCHAR(36) NOT NULL REFERENCES document_processing_jobs(id) ON DELETE CASCADE,
    event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    char_count INT NOT NULL,
    token_count INT NOT NULL DEFAULT 0,
    embedding_vector_id VARCHAR(255), -- Reference ID in Qdrant Vector DB
    metadata_json TEXT, -- JSON metadata string
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_doc_chunks_tenant_job ON document_chunks(tenant_id, job_id, chunk_index);
