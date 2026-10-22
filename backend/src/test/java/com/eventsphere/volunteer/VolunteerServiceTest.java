package com.eventsphere.volunteer;

import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.volunteer.dto.ShiftCreateRequest;
import com.eventsphere.volunteer.dto.VolunteerApplyRequest;
import com.eventsphere.volunteer.dto.VolunteerResponse;
import com.eventsphere.volunteer.entity.Volunteer;
import com.eventsphere.volunteer.entity.VolunteerPerformance;
import com.eventsphere.volunteer.repository.*;
import com.eventsphere.volunteer.service.VolunteerServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VolunteerServiceTest {

    @Mock
    private VolunteerRepository volunteerRepository;
    @Mock
    private VolunteerShiftRepository shiftRepository;
    @Mock
    private VolunteerTaskRepository taskRepository;
    @Mock
    private VolunteerPerformanceRepository performanceRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private VolunteerServiceImpl volunteerService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-vol-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testApplyVolunteerSuccess() {
        Event mockEvent = Event.builder().id("evt-vol-1").tenantId("tenant-vol-1").title("Expo 2026").build();
        User mockUser = User.builder().id("usr-vol-1").email("vol@expo.com").firstName("Frank").lastName("Wright").build();

        when(eventRepository.findByIdAndTenantId("evt-vol-1", "tenant-vol-1")).thenReturn(Optional.of(mockEvent));
        when(userRepository.findById("usr-vol-1")).thenReturn(Optional.of(mockUser));
        when(volunteerRepository.existsByTenantIdAndEventIdAndUserIdAndDeletedFalse("tenant-vol-1", "evt-vol-1", "usr-vol-1")).thenReturn(false);

        when(volunteerRepository.save(any(Volunteer.class))).thenAnswer(i -> {
            Volunteer v = i.getArgument(0);
            v.setId("vol-999");
            return v;
        });

        VolunteerApplyRequest request = VolunteerApplyRequest.builder()
                .eventId("evt-vol-1")
                .preferredRole("SCANNER")
                .build();

        VolunteerResponse response = volunteerService.applyVolunteer("usr-vol-1", request);

        assertNotNull(response);
        assertEquals("PENDING", response.getStatus());
        assertEquals("SCANNER", response.getAssignedRole());
        verify(performanceRepository, times(1)).save(any(VolunteerPerformance.class));
    }

    @Test
    void testShiftConflictDetected() {
        Event mockEvent = Event.builder().id("evt-vol-1").tenantId("tenant-vol-1").build();
        Volunteer mockVol = Volunteer.builder().id("vol-10").tenantId("tenant-vol-1").status("APPROVED").event(mockEvent).build();

        when(volunteerRepository.findByIdAndTenantIdAndDeletedFalse("vol-10", "tenant-vol-1")).thenReturn(Optional.of(mockVol));

        Instant start = Instant.now().plusSeconds(3600);
        Instant end = start.plusSeconds(7200);

        when(shiftRepository.countOverlappingShifts("tenant-vol-1", "vol-10", start, end)).thenReturn(1L);

        ShiftCreateRequest request = ShiftCreateRequest.builder()
                .volunteerId("vol-10")
                .shiftName("Gate A Check-in")
                .startTime(start)
                .endTime(end)
                .build();

        assertThrows(ResourceConflictException.class, () -> volunteerService.assignShift(request));
    }
}
