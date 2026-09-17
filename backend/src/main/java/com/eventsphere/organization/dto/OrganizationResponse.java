package com.eventsphere.organization.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationResponse {
    private String id;
    private String tenantId;
    private String name;
    private String legalName;
    private String taxId;
    private String website;
    private String supportEmail;
    private String address;
    private String city;
    private String country;
    private List<DepartmentResponse> departments;
    private Instant createdAt;
    private Instant updatedAt;
}
