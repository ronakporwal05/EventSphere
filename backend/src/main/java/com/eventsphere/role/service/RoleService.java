package com.eventsphere.role.service;

import com.eventsphere.role.dto.PermissionResponse;
import com.eventsphere.role.dto.RoleCreateRequest;
import com.eventsphere.role.dto.RoleResponse;

import java.util.List;

public interface RoleService {

    RoleResponse createCustomRole(RoleCreateRequest request);

    List<RoleResponse> getAllRoles();

    RoleResponse getRoleById(String id);

    List<PermissionResponse> getAllPermissions();
}
