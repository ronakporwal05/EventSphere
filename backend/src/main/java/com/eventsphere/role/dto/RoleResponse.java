package com.eventsphere.role.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {
    private String id;
    private String name;
    private String description;
    private boolean isSystemRole;
    private String tenantId;
    private Set<PermissionResponse> permissions;
    private Instant createdAt;
}
