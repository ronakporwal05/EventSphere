package com.eventsphere.attendance;

import com.eventsphere.attendance.dto.AttendanceResponse;
import com.eventsphere.attendance.dto.CheckInRequest;
import com.eventsphere.attendance.entity.Attendance;
import com.eventsphere.attendance.repository.AttendanceLogRepository;
import com.eventsphere.attendance.repository.AttendanceRepository;
import com.eventsphere.attendance.service.AttendanceServiceImpl;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.qr.service.QrValidationService;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.ticket.entity.Ticket;
import com.eventsphere.ticket.entity.TicketStatus;
import com.eventsphere.ticket.entity.TicketType;
import com.eventsphere.ticket.repository.TicketRepository;
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
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private AttendanceLogRepository attendanceLogRepository;
    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private QrValidationService qrValidationService;

    @InjectMocks
    private AttendanceServiceImpl attendanceService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-att-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testCheckInSuccess() {
        Event mockEvent = Event.builder().id("evt-att-10").tenantId("tenant-att-1").title("AI Summit").build();
        Registration mockReg = Registration.builder().id("reg-att-10").tenantId("tenant-att-1").attendeeName("Eve Adams").attendeeEmail("eve@adams.com").build();
        TicketType mockType = TicketType.builder().id("tt-att").name("Standard Pass").build();

        Ticket mockTicket = Ticket.builder()
                .id("tck-att-100")
                .tenantId("tenant-att-1")
                .event(mockEvent)
                .registration(mockReg)
                .ticketType(mockType)
                .ticketNumber("TCK-ATT-777")
                .status(TicketStatus.ISSUED)
                .build();

        User mockUser = User.builder().id("usr-staff").email("staff@event.com").build();

        when(ticketRepository.findByTenantIdAndTicketNumberAndDeletedFalse("tenant-att-1", "TCK-ATT-777")).thenReturn(Optional.of(mockTicket));
        when(attendanceRepository.existsByTenantIdAndEventIdAndTicketIdAndDeletedFalse("tenant-att-1", "evt-att-10", "tck-att-100")).thenReturn(false);
        when(userRepository.findById("usr-staff")).thenReturn(Optional.of(mockUser));
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(i -> {
            Attendance a = i.getArgument(0);
            a.setId("att-999");
            return a;
        });

        CheckInRequest request = CheckInRequest.builder()
                .eventId("evt-att-10")
                .ticketNumber("TCK-ATT-777")
                .checkInMethod("MANUAL")
                .build();

        AttendanceResponse response = attendanceService.checkIn("usr-staff", request);

        assertNotNull(response);
        assertEquals("Eve Adams", response.getAttendeeName());
        assertEquals("TCK-ATT-777", response.getTicketNumber());
        assertEquals(TicketStatus.USED, mockTicket.getStatus());
    }

    @Test
    void testDuplicateCheckInRejected() {
        Event mockEvent = Event.builder().id("evt-att-10").tenantId("tenant-att-1").title("AI Summit").build();
        Registration mockReg = Registration.builder().id("reg-att-10").tenantId("tenant-att-1").attendeeName("Eve Adams").attendeeEmail("eve@adams.com").build();

        Ticket mockTicket = Ticket.builder()
                .id("tck-att-100")
                .tenantId("tenant-att-1")
                .event(mockEvent)
                .registration(mockReg)
                .ticketNumber("TCK-ATT-777")
                .status(TicketStatus.ISSUED)
                .build();

        when(ticketRepository.findByTenantIdAndTicketNumberAndDeletedFalse("tenant-att-1", "TCK-ATT-777")).thenReturn(Optional.of(mockTicket));
        when(attendanceRepository.existsByTenantIdAndEventIdAndTicketIdAndDeletedFalse("tenant-att-1", "evt-att-10", "tck-att-100")).thenReturn(true);

        CheckInRequest request = CheckInRequest.builder()
                .eventId("evt-att-10")
                .ticketNumber("TCK-ATT-777")
                .build();

        assertThrows(ResourceConflictException.class, () -> attendanceService.checkIn(null, request));
    }
}
