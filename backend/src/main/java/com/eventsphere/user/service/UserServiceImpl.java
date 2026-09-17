package com.eventsphere.user.service;

import com.eventsphere.auth.entity.TenantMembership;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.TenantMembershipRepository;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.exception.UnauthorizedException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.user.dto.ChangePasswordRequest;
import com.eventsphere.user.dto.UserProfileResponse;
import com.eventsphere.user.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TenantMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return mapToProfile(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateUserProfile(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        User updated = userRepository.save(user);
        return mapToProfile(updated);
    }

    @Override
    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Current password does not match");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user ID: {}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return mapToProfile(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileResponse> getUsersByTenant(Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        List<TenantMembership> memberships = membershipRepository.findByUserId(tenantId);
        List<UserProfileResponse> profiles = memberships.stream()
                .map(m -> mapToProfile(m.getUser()))
                .collect(Collectors.toList());

        return new PageImpl<>(profiles, pageable, profiles.size());
    }

    private UserProfileResponse mapToProfile(User user) {
        List<TenantMembership> memberships = membershipRepository.findByUserId(user.getId());
        List<String> roles = memberships.stream()
                .map(m -> m.getRole().getName())
                .distinct()
                .collect(Collectors.toList());

        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
