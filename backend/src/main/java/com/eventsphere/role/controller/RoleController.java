package com.eventsphere.role.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.role.dto.PermissionResponse;
import com.eventsphere.role.dto.RoleCreateRequest;
import com.eventsphere.role.dto.RoleResponse;
import com.eventsphere.role.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    @Auditable(action = "CREATE_CUSTOM_ROLE", entityType = "ROLE")
    public ResponseEntity<ApiResponse<RoleResponse>> createCustomRole(@Valid @RequestBody RoleCreateRequest request) {
        RoleResponse response = roleService.createCustomRole(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Custom role created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        List<RoleResponse> roles = roleService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.success(roles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> getRoleById(@PathVariable("id") String id) {
        RoleResponse response = roleService.getRoleById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/permissions")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getAllPermissions() {
        List<PermissionResponse> permissions = roleService.getAllPermissions();
        return ResponseEntity.ok(ApiResponse.success(permissions));
    }
}
