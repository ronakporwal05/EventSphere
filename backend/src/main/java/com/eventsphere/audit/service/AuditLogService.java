package com.eventsphere.audit.service;

import com.eventsphere.audit.dto.AuditLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {
    Page<AuditLogResponse> getAuditLogsByTenant(Pageable pageable);
}
