package com.eventsphere.role.service;

import com.eventsphere.auth.entity.Permission;
import com.eventsphere.auth.entity.Role;
import com.eventsphere.auth.repository.RoleRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.role.dto.PermissionResponse;
import com.eventsphere.role.dto.RoleCreateRequest;
import com.eventsphere.role.dto.RoleResponse;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public RoleResponse createCustomRole(RoleCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating custom role '{}' for tenant '{}'", request.getName(), tenantId);

        if (roleRepository.findByName(request.getName()).isPresent()) {
            throw new ResourceConflictException("Role with name '" + request.getName() + "' already exists");
        }

        Set<Permission> permissions = new HashSet<>();
        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            for (String permId : request.getPermissionIds()) {
                Permission p = entityManager.find(Permission.class, permId);
                if (p != null) {
                    permissions.add(p);
                }
            }
        }

        Role role = Role.builder()
                .id(UUID.randomUUID().toString())
                .name(request.getName().toUpperCase().trim())
                .description(request.getDescription())
                .isSystemRole(false)
                .tenantId(tenantId)
                .permissions(permissions)
                .build();

        Role saved = roleRepository.save(role);
        return mapToRoleResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream().map(this::mapToRoleResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(String id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + id));
        return mapToRoleResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {
        List<Permission> permissions = entityManager.createQuery("SELECT p FROM Permission p", Permission.class).getResultList();
        return permissions.stream().map(p -> PermissionResponse.builder()
                .id(p.getId())
                .resource(p.getResource())
                .action(p.getAction())
                .description(p.getDescription())
                .build()).collect(Collectors.toList());
    }

    private RoleResponse mapToRoleResponse(Role role) {
        Set<PermissionResponse> perms = role.getPermissions() != null ?
                role.getPermissions().stream().map(p -> PermissionResponse.builder()
                        .id(p.getId())
                        .resource(p.getResource())
                        .action(p.getAction())
                        .description(p.getDescription())
                        .build()).collect(Collectors.toSet()) : Set.of();

        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .isSystemRole(role.isSystemRole())
                .tenantId(role.getTenantId())
                .permissions(perms)
                .createdAt(role.getCreatedAt())
                .build();
    }
}
