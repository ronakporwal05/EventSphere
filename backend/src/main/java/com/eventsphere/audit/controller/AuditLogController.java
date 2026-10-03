package com.eventsphere.audit.controller;

import com.eventsphere.audit.dto.AuditLogResponse;
import com.eventsphere.audit.service.AuditLogService;
import com.eventsphere.common.dto.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    public ResponseEntity<PagedResponse<AuditLogResponse>> getAuditLogsByTenant(Pageable pageable) {
        Page<AuditLogResponse> logs = auditLogService.getAuditLogsByTenant(pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(logs, "Audit logs retrieved successfully"));
    }
}
