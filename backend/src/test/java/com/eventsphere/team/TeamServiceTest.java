package com.eventsphere.team;

import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.team.dto.TeamCreateRequest;
import com.eventsphere.team.dto.TeamResponse;
import com.eventsphere.team.entity.Team;
import com.eventsphere.team.entity.TeamMember;
import com.eventsphere.team.repository.TeamInvitationRepository;
import com.eventsphere.team.repository.TeamMemberRepository;
import com.eventsphere.team.repository.TeamRepository;
import com.eventsphere.team.service.TeamServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;
    @Mock
    private TeamMemberRepository teamMemberRepository;
    @Mock
    private TeamInvitationRepository teamInvitationRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TeamServiceImpl teamService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-team-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testCreateTeamSuccess() {
        Event mockEvent = Event.builder().id("evt-50").tenantId("tenant-team-1").title("CodeFest 2026").build();
        User mockLeader = User.builder().id("usr-leader").email("leader@hack.com").firstName("Alice").lastName("Smith").build();

        when(eventRepository.findByIdAndTenantId("evt-50", "tenant-team-1")).thenReturn(Optional.of(mockEvent));
        when(userRepository.findById("usr-leader")).thenReturn(Optional.of(mockLeader));
        when(teamRepository.existsByTenantIdAndEventIdAndNameAndDeletedFalse("tenant-team-1", "evt-50", "Cyber Knights")).thenReturn(false);

        when(teamRepository.save(any(Team.class))).thenAnswer(i -> {
            Team t = i.getArgument(0);
            t.setId("team-777");
            return t;
        });

        TeamMember leaderMember = TeamMember.builder()
                .id("tm-1")
                .user(mockLeader)
                .role("LEADER")
                .status("ACTIVE")
                .build();
        when(teamMemberRepository.findByTenantIdAndTeamIdAndStatus("tenant-team-1", "team-777", "ACTIVE")).thenReturn(List.of(leaderMember));

        TeamCreateRequest request = TeamCreateRequest.builder()
                .eventId("evt-50")
                .name("Cyber Knights")
                .minTeamSize(2)
                .maxTeamSize(4)
                .build();

        TeamResponse response = teamService.createTeam("usr-leader", request);

        assertNotNull(response);
        assertEquals("Cyber Knights", response.getName());
        assertEquals("usr-leader", response.getLeaderUserId());
        assertEquals(1, response.getMembers().size());
        assertTrue(response.getCode().startsWith("TM-"));
    }
}
