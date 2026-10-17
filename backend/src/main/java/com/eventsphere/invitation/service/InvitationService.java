package com.eventsphere.invitation.service;

import com.eventsphere.invitation.dto.AcceptInvitationRequest;
import com.eventsphere.invitation.dto.InvitationResponse;
import com.eventsphere.invitation.dto.InviteUserRequest;

import java.util.List;

public interface InvitationService {

    InvitationResponse sendInvitation(String currentUserId, InviteUserRequest request);

    void acceptInvitation(AcceptInvitationRequest request);

    List<InvitationResponse> getInvitationsByTenant();

    void revokeInvitation(String invitationId);
}
