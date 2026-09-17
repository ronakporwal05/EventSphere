package com.eventsphere.role.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleCreateRequest {

    @NotBlank(message = "Role name is required")
    private String name;

    private String description;
    private Set<String> permissionIds;
}
