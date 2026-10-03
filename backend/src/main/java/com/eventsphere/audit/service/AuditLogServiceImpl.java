package com.eventsphere.audit.service;

import com.eventsphere.audit.dto.AuditLogResponse;
import com.eventsphere.audit.entity.AuditLog;
import com.eventsphere.audit.repository.AuditLogRepository;
import com.eventsphere.common.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getAuditLogsByTenant(Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return auditLogRepository.findByTenantId(tenantId, pageable).map(this::mapToResponse);
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .tenantId(log.getTenantId())
                .actorUserId(log.getActorUserId())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .ipAddress(log.getIpAddress())
                .detailsJson(log.getDetailsJson())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
