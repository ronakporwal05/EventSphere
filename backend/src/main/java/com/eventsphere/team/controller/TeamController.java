package com.eventsphere.team.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.team.dto.*;
import com.eventsphere.team.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    @Auditable(action = "CREATE_TEAM", entityType = "TEAM")
    public ResponseEntity<ApiResponse<TeamResponse>> createTeam(@Valid @RequestBody TeamCreateRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        TeamResponse response = teamService.createTeam(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Team created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamResponse>> getTeamById(@PathVariable("id") String id) {
        TeamResponse response = teamService.getTeamById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<TeamResponse>> getTeamByCode(@PathVariable("code") String code) {
        TeamResponse response = teamService.getTeamByCode(code);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<PagedResponse<TeamResponse>> getTeamsByEvent(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<TeamResponse> page = teamService.getTeamsByEvent(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Teams retrieved successfully"));
    }

    @PostMapping("/invite")
    @Auditable(action = "INVITE_TEAM_MEMBER", entityType = "TEAM_INVITATION")
    public ResponseEntity<ApiResponse<TeamInvitationResponse>> inviteMember(@Valid @RequestBody TeamInviteRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        TeamInvitationResponse response = teamService.inviteMember(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Team invitation sent successfully", response));
    }

    @PostMapping("/invitations/accept")
    @Auditable(action = "ACCEPT_TEAM_INVITATION", entityType = "TEAM")
    public ResponseEntity<ApiResponse<Void>> acceptInvitation(@RequestParam("token") String token) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        teamService.acceptInvitation(currentUserId, token);
        return ResponseEntity.ok(ApiResponse.success("Team invitation accepted successfully", null));
    }

    @PostMapping("/invitations/reject")
    @Auditable(action = "REJECT_TEAM_INVITATION", entityType = "TEAM")
    public ResponseEntity<ApiResponse<Void>> rejectInvitation(@RequestParam("token") String token) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        teamService.rejectInvitation(currentUserId, token);
        return ResponseEntity.ok(ApiResponse.success("Team invitation rejected", null));
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    @Auditable(action = "REMOVE_TEAM_MEMBER", entityType = "TEAM")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable("teamId") String teamId,
            @PathVariable("userId") String userId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        teamService.removeMember(currentUserId, teamId, userId);
        return ResponseEntity.ok(ApiResponse.success("Team member removed successfully", null));
    }

    @PostMapping("/{teamId}/leave")
    @Auditable(action = "LEAVE_TEAM", entityType = "TEAM")
    public ResponseEntity<ApiResponse<Void>> leaveTeam(@PathVariable("teamId") String teamId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        teamService.leaveTeam(currentUserId, teamId);
        return ResponseEntity.ok(ApiResponse.success("Left team successfully", null));
    }

    @DeleteMapping("/{teamId}")
    @Auditable(action = "DISBAND_TEAM", entityType = "TEAM")
    public ResponseEntity<ApiResponse<Void>> disbandTeam(@PathVariable("teamId") String teamId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        teamService.disbandTeam(currentUserId, teamId);
        return ResponseEntity.ok(ApiResponse.success("Team disbanded successfully", null));
    }

    @PutMapping("/{teamId}/status")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPDATE_TEAM_STATUS", entityType = "TEAM")
    public ResponseEntity<ApiResponse<TeamResponse>> updateTeamStatus(
            @PathVariable("teamId") String teamId,
            @RequestParam("status") String status) {
        TeamResponse response = teamService.updateTeamStatus(teamId, status);
        return ResponseEntity.ok(ApiResponse.success("Team status updated successfully", response));
    }
}
