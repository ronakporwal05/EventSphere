package com.eventsphere.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private String id;
    private String tenantId;
    private String actorUserId;
    private String action;
    private String entityType;
    private String entityId;
    private String ipAddress;
    private String detailsJson;
    private Instant createdAt;
}
