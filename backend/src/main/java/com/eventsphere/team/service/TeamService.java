package com.eventsphere.team.service;

import com.eventsphere.team.dto.TeamCreateRequest;
import com.eventsphere.team.dto.TeamInvitationResponse;
import com.eventsphere.team.dto.TeamInviteRequest;
import com.eventsphere.team.dto.TeamResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TeamService {

    TeamResponse createTeam(String leaderUserId, TeamCreateRequest request);

    TeamResponse getTeamById(String id);

    TeamResponse getTeamByCode(String code);

    Page<TeamResponse> getTeamsByEvent(String eventId, Pageable pageable);

    TeamInvitationResponse inviteMember(String currentUserId, TeamInviteRequest request);

    void acceptInvitation(String currentUserId, String token);

    void rejectInvitation(String currentUserId, String token);

    void removeMember(String leaderUserId, String teamId, String memberUserId);

    void leaveTeam(String currentUserId, String teamId);

    void disbandTeam(String leaderUserId, String teamId);

    TeamResponse updateTeamStatus(String teamId, String status);
}
