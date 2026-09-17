package com.eventsphere.organization.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationRequest {

    @NotBlank(message = "Organization name is required")
    private String name;

    private String legalName;
    private String taxId;
    private String website;

    @Email(message = "Invalid email format")
    private String supportEmail;

    private String address;
    private String city;
    private String country;
}
