package com.eventsphere.common.audit;

import com.eventsphere.audit.entity.AuditLog;
import com.eventsphere.audit.repository.AuditLogRepository;
import com.eventsphere.common.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @Around("@annotation(auditable)")
    public Object auditExecution(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        String tenantId = TenantContext.getTenantId();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String actorUserId = (auth != null && auth.isAuthenticated()) ? auth.getName() : "ANONYMOUS";

        log.info("[AUDIT-START] Action: {}, EntityType: {}, Actor: {}, Tenant: {}",
                auditable.action(), auditable.entityType(), actorUserId, tenantId);

        Object result = joinPoint.proceed();

        try {
            AuditLog auditLog = AuditLog.builder()
                    .tenantId(tenantId)
            .actorUserId(actorUserId)
            .action(auditable.action())
            .entityType(auditable.entityType())
            .detailsJson("Method: " + joinPoint.getSignature().toShortString())
            .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to persist audit log entry", e);
        }

        log.info("[AUDIT-SUCCESS] Action: {}, EntityType: {}", auditable.action(), auditable.entityType());
        return result;
    }
}
