package com.eventsphere.team.service;

import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.team.dto.*;
import com.eventsphere.team.entity.Team;
import com.eventsphere.team.entity.TeamInvitation;
import com.eventsphere.team.entity.TeamMember;
import com.eventsphere.team.repository.TeamInvitationRepository;
import com.eventsphere.team.repository.TeamMemberRepository;
import com.eventsphere.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamInvitationRepository teamInvitationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TeamResponse createTeam(String leaderUserId, TeamCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating team '{}' for event '{}'", request.getName(), request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        User leader = userRepository.findById(leaderUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Leader user not found"));

        if (teamRepository.existsByTenantIdAndEventIdAndNameAndDeletedFalse(tenantId, event.getId(), request.getName())) {
            throw new ResourceConflictException("Team with name '" + request.getName() + "' already exists for this event.");
        }

        String teamCode = "TM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Team team = Team.builder()
                .tenantId(tenantId)
                .event(event)
                .name(request.getName())
                .code(teamCode)
                .leader(leader)
                .minTeamSize(request.getMinTeamSize() > 0 ? request.getMinTeamSize() : 2)
                .maxTeamSize(request.getMaxTeamSize() > 0 ? request.getMaxTeamSize() : 5)
                .status("PENDING")
                .build();

        Team savedTeam = teamRepository.save(team);

        TeamMember leaderMember = TeamMember.builder()
                .tenantId(tenantId)
                .team(savedTeam)
                .user(leader)
                .role("LEADER")
                .status("ACTIVE")
                .build();

        teamMemberRepository.save(leaderMember);
        return mapToTeamResponse(savedTeam);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse getTeamById(String id) {
        String tenantId = TenantContext.getTenantId();
        Team team = teamRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + id));
        return mapToTeamResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse getTeamByCode(String code) {
        String tenantId = TenantContext.getTenantId();
        Team team = teamRepository.findByTenantIdAndCodeAndDeletedFalse(tenantId, code)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with code: " + code));
        return mapToTeamResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamResponse> getTeamsByEvent(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return teamRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable).map(this::mapToTeamResponse);
    }

    @Override
    @Transactional
    public TeamInvitationResponse inviteMember(String currentUserId, TeamInviteRequest request) {
        String tenantId = TenantContext.getTenantId();
        Team team = teamRepository.findByIdAndTenantIdAndDeletedFalse(request.getTeamId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + request.getTeamId()));

        User inviter = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Inviting user not found"));

        if (!team.getLeader().getId().equals(currentUserId)) {
            throw new ResourceConflictException("Only the team leader can invite members.");
        }

        long activeCount = teamMemberRepository.countByTenantIdAndTeamIdAndStatus(tenantId, team.getId(), "ACTIVE");
        if (activeCount >= team.getMaxTeamSize()) {
            throw new ResourceConflictException("Team capacity limit reached (" + team.getMaxTeamSize() + " members).");
        }

        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plusSeconds(86400 * 3); // 3 days

        TeamInvitation invitation = TeamInvitation.builder()
                .tenantId(tenantId)
                .team(team)
                .inviteeEmail(request.getInviteeEmail().toLowerCase().trim())
                .invitedBy(inviter)
                .token(token)
                .status("PENDING")
                .expiresAt(expiresAt)
                .build();

        TeamInvitation saved = teamInvitationRepository.save(invitation);
        return mapToInvitationResponse(saved);
    }

    @Override
    @Transactional
    public void acceptInvitation(String currentUserId, String token) {
        String tenantId = TenantContext.getTenantId();
        TeamInvitation invitation = teamInvitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired team invitation token"));

        if (!"PENDING".equalsIgnoreCase(invitation.getStatus())) {
            throw new ResourceConflictException("Invitation has already been " + invitation.getStatus().toLowerCase());
        }

        if (Instant.now().isAfter(invitation.getExpiresAt())) {
            invitation.setStatus("EXPIRED");
            teamInvitationRepository.save(invitation);
            throw new ResourceConflictException("Team invitation token has expired");
        }

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getEmail().equalsIgnoreCase(invitation.getInviteeEmail())) {
            throw new ResourceConflictException("This invitation was issued to " + invitation.getInviteeEmail());
        }

        Team team = invitation.getTeam();
        long activeCount = teamMemberRepository.countByTenantIdAndTeamIdAndStatus(tenantId, team.getId(), "ACTIVE");
        if (activeCount >= team.getMaxTeamSize()) {
            throw new ResourceConflictException("Team is already at maximum capacity.");
        }

        TeamMember member = TeamMember.builder()
                .tenantId(tenantId)
                .team(team)
                .user(user)
                .role("MEMBER")
                .status("ACTIVE")
                .build();

        teamMemberRepository.save(member);

        invitation.setStatus("ACCEPTED");
        teamInvitationRepository.save(invitation);

        // Auto approve team if minimum size met
        if (activeCount + 1 >= team.getMinTeamSize() && "PENDING".equalsIgnoreCase(team.getStatus())) {
            team.setStatus("APPROVED");
            teamRepository.save(team);
        }
    }

    @Override
    @Transactional
    public void rejectInvitation(String currentUserId, String token) {
        TeamInvitation invitation = teamInvitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation token not found"));

        invitation.setStatus("REJECTED");
        teamInvitationRepository.save(invitation);
    }

    @Override
    @Transactional
    public void removeMember(String leaderUserId, String teamId, String memberUserId) {
        String tenantId = TenantContext.getTenantId();
        Team team = teamRepository.findByIdAndTenantIdAndDeletedFalse(teamId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        if (!team.getLeader().getId().equals(leaderUserId)) {
            throw new ResourceConflictException("Only the team leader can remove members.");
        }

        if (leaderUserId.equals(memberUserId)) {
            throw new ResourceConflictException("Leader cannot be removed. Disband the team instead.");
        }

        TeamMember member = teamMemberRepository.findByTenantIdAndTeamIdAndUserIdAndStatus(tenantId, teamId, memberUserId, "ACTIVE")
                .orElseThrow(() -> new ResourceNotFoundException("Active member not found in team"));

        member.setStatus("REMOVED");
        teamMemberRepository.save(member);
    }

    @Override
    @Transactional
    public void leaveTeam(String currentUserId, String teamId) {
        String tenantId = TenantContext.getTenantId();
        Team team = teamRepository.findByIdAndTenantIdAndDeletedFalse(teamId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        if (team.getLeader().getId().equals(currentUserId)) {
            throw new ResourceConflictException("Leader cannot leave the team. Disband team instead.");
        }

        TeamMember member = teamMemberRepository.findByTenantIdAndTeamIdAndUserIdAndStatus(tenantId, teamId, currentUserId, "ACTIVE")
                .orElseThrow(() -> new ResourceNotFoundException("Active member not found in team"));

        member.setStatus("LEFT");
        teamMemberRepository.save(member);
    }

    @Override
    @Transactional
    public void disbandTeam(String leaderUserId, String teamId) {
        String tenantId = TenantContext.getTenantId();
        Team team = teamRepository.findByIdAndTenantIdAndDeletedFalse(teamId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        if (!team.getLeader().getId().equals(leaderUserId)) {
            throw new ResourceConflictException("Only the team leader can disband the team.");
        }

        team.setStatus("DISBANDED");
        team.setDeleted(true);
        teamRepository.save(team);
    }

    @Override
    @Transactional
    public TeamResponse updateTeamStatus(String teamId, String status) {
        String tenantId = TenantContext.getTenantId();
        Team team = teamRepository.findByIdAndTenantIdAndDeletedFalse(teamId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        team.setStatus(status.toUpperCase());
        Team saved = teamRepository.save(team);
        return mapToTeamResponse(saved);
    }

    private TeamResponse mapToTeamResponse(Team team) {
        List<TeamMember> activeMembers = teamMemberRepository.findByTenantIdAndTeamIdAndStatus(team.getTenantId(), team.getId(), "ACTIVE");
        List<TeamMemberResponse> memberDTOs = activeMembers.stream()
                .map(m -> TeamMemberResponse.builder()
                        .id(m.getId())
                        .userId(m.getUser().getId())
                        .userEmail(m.getUser().getEmail())
                        .userName(m.getUser().getFirstName() + " " + m.getUser().getLastName())
                        .role(m.getRole())
                        .status(m.getStatus())
                        .joinedAt(m.getJoinedAt())
                        .build())
                .collect(Collectors.toList());

        return TeamResponse.builder()
                .id(team.getId())
                .eventId(team.getEvent().getId())
                .name(team.getName())
                .code(team.getCode())
                .leaderUserId(team.getLeader().getId())
                .leaderEmail(team.getLeader().getEmail())
                .minTeamSize(team.getMinTeamSize())
                .maxTeamSize(team.getMaxTeamSize())
                .status(team.getStatus())
                .members(memberDTOs)
                .createdAt(team.getCreatedAt())
                .build();
    }

    private TeamInvitationResponse mapToInvitationResponse(TeamInvitation inv) {
        return TeamInvitationResponse.builder()
                .id(inv.getId())
                .teamId(inv.getTeam().getId())
                .teamName(inv.getTeam().getName())
                .inviteeEmail(inv.getInviteeEmail())
                .invitedByEmail(inv.getInvitedBy().getEmail())
                .token(inv.getToken())
                .status(inv.getStatus())
                .expiresAt(inv.getExpiresAt())
                .createdAt(inv.getCreatedAt())
                .build();
    }
}
