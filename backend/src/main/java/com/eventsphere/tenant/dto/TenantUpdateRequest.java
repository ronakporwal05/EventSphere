package com.eventsphere.tenant.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantUpdateRequest {

    private String name;
    private String logoUrl;

    @Email(message = "Invalid email format")
    private String contactEmail;

    private String subscriptionTier;
    private String status;
    private String themeConfig;
}
