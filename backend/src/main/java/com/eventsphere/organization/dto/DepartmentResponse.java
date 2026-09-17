package com.eventsphere.organization.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {
    private String id;
    private String organizationId;
    private String name;
    private String code;
    private String description;
    private Instant createdAt;
}
