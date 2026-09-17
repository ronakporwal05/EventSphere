package com.eventsphere.user.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.user.dto.ChangePasswordRequest;
import com.eventsphere.user.dto.UserProfileResponse;
import com.eventsphere.user.dto.UserUpdateRequest;
import com.eventsphere.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUserProfile() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserProfileResponse response = userService.getCurrentUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    @Auditable(action = "UPDATE_PROFILE", entityType = "USER")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateCurrentUserProfile(@Valid @RequestBody UserUpdateRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserProfileResponse response = userService.updateUserProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping("/me/change-password")
    @Auditable(action = "CHANGE_PASSWORD", entityType = "USER")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.changePassword(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserById(@PathVariable("id") String id) {
        UserProfileResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    public ResponseEntity<PagedResponse<UserProfileResponse>> getUsersByTenant(Pageable pageable) {
        Page<UserProfileResponse> users = userService.getUsersByTenant(pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(users, "Users retrieved successfully"));
    }
}
