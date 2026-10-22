package com.eventsphere.ticket;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import com.eventsphere.ticket.dto.TicketGenerateRequest;
import com.eventsphere.ticket.dto.TicketResponse;
import com.eventsphere.ticket.entity.Ticket;
import com.eventsphere.ticket.entity.TicketStatus;
import com.eventsphere.ticket.entity.TicketType;
import com.eventsphere.ticket.repository.TicketRepository;
import com.eventsphere.ticket.repository.TicketTypeRepository;
import com.eventsphere.ticket.service.TicketServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private TicketTypeRepository ticketTypeRepository;
    @Mock
    private RegistrationRepository registrationRepository;
    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private TicketServiceImpl ticketService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-tck-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testGenerateTicketSuccess() {
        Event mockEvent = Event.builder().id("evt-88").tenantId("tenant-tck-1").title("Summit 2026").build();

        Registration mockReg = Registration.builder()
                .id("reg-55")
                .tenantId("tenant-tck-1")
                .event(mockEvent)
                .attendeeName("Bob Builder")
                .attendeeEmail("bob@builder.com")
                .registrationNumber("REG-SUMMIT-1234")
                .build();

        TicketType mockType = TicketType.builder()
                .id("tt-vip")
                .tenantId("tenant-tck-1")
                .event(mockEvent)
                .name("VIP Pass")
                .price(BigDecimal.valueOf(250.00))
                .availableQuantity(50)
                .build();

        when(registrationRepository.findByIdAndTenantIdAndDeletedFalse("reg-55", "tenant-tck-1")).thenReturn(Optional.of(mockReg));
        when(ticketTypeRepository.findByIdAndTenantIdAndDeletedFalse("tt-vip", "tenant-tck-1")).thenReturn(Optional.of(mockType));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> {
            Ticket t = i.getArgument(0);
            t.setId("tck-999");
            return t;
        });

        TicketGenerateRequest request = TicketGenerateRequest.builder()
                .registrationId("reg-55")
                .ticketTypeId("tt-vip")
                .build();

        TicketResponse response = ticketService.generateTicket(request);

        assertNotNull(response);
        assertEquals("Bob Builder", response.getAttendeeName());
        assertEquals("VIP Pass", response.getTicketTypeName());
        assertEquals(TicketStatus.ISSUED, response.getStatus());
        assertTrue(response.getTicketNumber().startsWith("TCK-"));
        assertEquals(49, mockType.getAvailableQuantity());
    }
}
