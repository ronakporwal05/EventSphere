package com.eventsphere.tenant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantResponse {

    private String id;
    private String name;
    private String slug;
    private String logoUrl;
    private String contactEmail;
    private String subscriptionTier;
    private String status;
    private String themeConfig;
    private Instant createdAt;
    private Instant updatedAt;
}
