package com.eventsphere.invitation.service;

import com.eventsphere.auth.entity.Role;
import com.eventsphere.auth.entity.TenantMembership;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.RoleRepository;
import com.eventsphere.auth.repository.TenantMembershipRepository;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.auth.service.EmailVerificationService;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.invitation.dto.AcceptInvitationRequest;
import com.eventsphere.invitation.dto.InvitationResponse;
import com.eventsphere.invitation.dto.InviteUserRequest;
import com.eventsphere.invitation.entity.Invitation;
import com.eventsphere.invitation.repository.InvitationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvitationServiceImpl implements InvitationService {

    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TenantMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    @Override
    @Transactional
    public InvitationResponse sendInvitation(String currentUserId, InviteUserRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Sending invitation to '{}' for tenant '{}'", request.getEmail(), tenantId);

        User inviter = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Inviting user not found"));

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + request.getRoleId()));

        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plusSeconds(86400 * 7); // 7 days

        Invitation invitation = Invitation.builder()
                .tenantId(tenantId)
                .email(request.getEmail().toLowerCase().trim())
                .role(role)
                .department(request.getDepartment())
                .token(token)
                .status("PENDING")
                .invitedBy(inviter)
                .expiresAt(expiresAt)
                .build();

        Invitation saved = invitationRepository.save(invitation);

        // Async email dispatch
        emailVerificationService.sendVerificationEmail(request.getEmail(), token);

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void acceptInvitation(AcceptInvitationRequest request) {
        Invitation invitation = invitationRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired invitation token"));

        if (!"PENDING".equalsIgnoreCase(invitation.getStatus())) {
            throw new ResourceConflictException("Invitation has already been " + invitation.getStatus().toLowerCase());
        }

        if (Instant.now().isAfter(invitation.getExpiresAt())) {
            invitation.setStatus("EXPIRED");
            invitationRepository.save(invitation);
            throw new ResourceConflictException("Invitation token has expired");
        }

        User user = userRepository.findByEmail(invitation.getEmail())
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .id(UUID.randomUUID().toString())
                            .email(invitation.getEmail())
                            .passwordHash(passwordEncoder.encode(request.getPassword()))
                            .firstName(request.getFirstName())
                            .lastName(request.getLastName())
                            .emailVerified(true)
                            .status("ACTIVE")
                            .build();
                    return userRepository.save(newUser);
                });

        TenantMembership membership = TenantMembership.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(invitation.getTenantId())
                .user(user)
                .role(invitation.getRole())
                .department(invitation.getDepartment())
                .build();

        membershipRepository.save(membership);

        invitation.setStatus("ACCEPTED");
        invitationRepository.save(invitation);
        log.info("User '{}' successfully accepted invitation into tenant '{}'", user.getEmail(), invitation.getTenantId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvitationResponse> getInvitationsByTenant() {
        String tenantId = TenantContext.getTenantId();
        return invitationRepository.findByTenantId(tenantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void revokeInvitation(String invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with ID: " + invitationId));

        invitation.setStatus("REVOKED");
        invitationRepository.save(invitation);
        log.info("Revoked invitation ID: {}", invitationId);
    }

    private InvitationResponse mapToResponse(Invitation invitation) {
        return InvitationResponse.builder()
                .id(invitation.getId())
                .tenantId(invitation.getTenantId())
                .email(invitation.getEmail())
                .roleName(invitation.getRole().getName())
                .department(invitation.getDepartment())
                .status(invitation.getStatus())
                .invitedByEmail(invitation.getInvitedBy().getEmail())
                .expiresAt(invitation.getExpiresAt())
                .createdAt(invitation.getCreatedAt())
                .build();
    }
}
