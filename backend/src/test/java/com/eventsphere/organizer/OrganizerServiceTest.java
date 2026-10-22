package com.eventsphere.organizer;

import com.eventsphere.attendance.service.AttendanceService;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.notification.service.NotificationService;
import com.eventsphere.organizer.dto.BadgePrintResponse;
import com.eventsphere.organizer.dto.WalkInRegistrationRequest;
import com.eventsphere.organizer.dto.WalkInRegistrationResponse;
import com.eventsphere.organizer.entity.OrganizerAction;
import com.eventsphere.organizer.entity.PrintedBadge;
import com.eventsphere.organizer.repository.OrganizerActionRepository;
import com.eventsphere.organizer.repository.PrintedBadgeRepository;
import com.eventsphere.organizer.service.OrganizerServiceImpl;
import com.eventsphere.registration.dto.RegistrationResponse;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import com.eventsphere.registration.service.RegistrationService;
import com.eventsphere.ticket.dto.TicketResponse;
import com.eventsphere.ticket.repository.TicketRepository;
import com.eventsphere.ticket.service.TicketService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrganizerServiceTest {

    @Mock
    private RegistrationService registrationService;
    @Mock
    private TicketService ticketService;
    @Mock
    private AttendanceService attendanceService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private RegistrationRepository registrationRepository;
    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PrintedBadgeRepository printedBadgeRepository;
    @Mock
    private OrganizerActionRepository organizerActionRepository;

    @InjectMocks
    private OrganizerServiceImpl organizerService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-org-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testProcessWalkInRegistrationSuccess() {
        User mockOrganizer = User.builder().id("usr-org-1").email("admin@eventsphere.ai").build();
        RegistrationResponse mockRegResp = RegistrationResponse.builder().id("reg-walk-1").eventId("evt-org-1").attendeeName("Hank Pym").attendeeEmail("hank@pym.com").build();
        TicketResponse mockTicketResp = TicketResponse.builder().id("tck-walk-1").ticketNumber("TCK-WALK-100").build();

        when(userRepository.findById("usr-org-1")).thenReturn(Optional.of(mockOrganizer));
        when(registrationService.registerAttendee(any())).thenReturn(mockRegResp);
        when(ticketService.generateTicket("reg-walk-1", null)).thenReturn(mockTicketResp);

        WalkInRegistrationRequest request = WalkInRegistrationRequest.builder()
                .eventId("evt-org-1")
                .attendeeName("Hank Pym")
                .attendeeEmail("hank@pym.com")
                .autoCheckIn(false)
                .build();

        WalkInRegistrationResponse response = organizerService.processWalkInRegistration("usr-org-1", request);

        assertNotNull(response);
        assertEquals("reg-walk-1", response.getRegistration().getId());
        assertEquals("TCK-WALK-100", response.getTicket().getTicketNumber());
        verify(organizerActionRepository, times(1)).save(any(OrganizerAction.class));
    }

    @Test
    void testPrintBadgeSuccess() {
        Event mockEvent = Event.builder().id("evt-org-1").tenantId("tenant-org-1").title("Enterprise Summit").build();
        Registration mockReg = Registration.builder().id("reg-badge-1").tenantId("tenant-org-1").event(mockEvent).attendeeName("Carol Danvers").attendeeEmail("carol@marvel.com").build();
        User mockOrganizer = User.builder().id("usr-org-1").email("admin@eventsphere.ai").build();

        when(registrationRepository.findByIdAndTenantIdAndDeletedFalse("reg-badge-1", "tenant-org-1")).thenReturn(Optional.of(mockReg));
        when(userRepository.findById("usr-org-1")).thenReturn(Optional.of(mockOrganizer));
        when(printedBadgeRepository.findByTenantIdAndRegistrationId("tenant-org-1", "reg-badge-1")).thenReturn(Optional.empty());

        when(printedBadgeRepository.save(any(PrintedBadge.class))).thenAnswer(i -> {
            PrintedBadge b = i.getArgument(0);
            b.setId("badge-999");
            return b;
        });

        BadgePrintResponse response = organizerService.printBadge("usr-org-1", "reg-badge-1", "VIP");

        assertNotNull(response);
        assertEquals("Carol Danvers", response.getAttendeeName());
        assertEquals(1, response.getPrintCount());
        assertTrue(response.getZplCode().contains("Carol Danvers"));
    }
}
