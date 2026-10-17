package com.eventsphere.invitation.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.invitation.dto.AcceptInvitationRequest;
import com.eventsphere.invitation.dto.InvitationResponse;
import com.eventsphere.invitation.dto.InviteUserRequest;
import com.eventsphere.invitation.service.InvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    @Auditable(action = "SEND_INVITATION", entityType = "INVITATION")
    public ResponseEntity<ApiResponse<InvitationResponse>> sendInvitation(@Valid @RequestBody InviteUserRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        InvitationResponse response = invitationService.sendInvitation(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Invitation sent successfully", response));
    }

    @PostMapping("/accept")
    @Auditable(action = "ACCEPT_INVITATION", entityType = "INVITATION")
    public ResponseEntity<ApiResponse<Void>> acceptInvitation(@Valid @RequestBody AcceptInvitationRequest request) {
        invitationService.acceptInvitation(request);
        return ResponseEntity.ok(ApiResponse.success("Invitation accepted successfully", null));
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    public ResponseEntity<ApiResponse<List<InvitationResponse>>> getInvitationsByTenant() {
        List<InvitationResponse> invitations = invitationService.getInvitationsByTenant();
        return ResponseEntity.ok(ApiResponse.success(invitations));
    }

    @PostMapping("/{id}/revoke")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORGANIZATION_ADMIN')")
    @Auditable(action = "REVOKE_INVITATION", entityType = "INVITATION")
    public ResponseEntity<ApiResponse<Void>> revokeInvitation(@PathVariable("id") String id) {
        invitationService.revokeInvitation(id);
        return ResponseEntity.ok(ApiResponse.success("Invitation revoked successfully", null));
    }
}
