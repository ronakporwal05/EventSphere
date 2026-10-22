package com.eventsphere.registration;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.entity.EventState;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.registration.dto.RegistrationRequest;
import com.eventsphere.registration.dto.RegistrationResponse;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.entity.RegistrationStatus;
import com.eventsphere.registration.repository.RegistrationRepository;
import com.eventsphere.registration.service.RegistrationServiceImpl;
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
class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrationRepository;
    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private RegistrationServiceImpl registrationService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-reg-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testRegisterAttendeeSuccess() {
        Event mockEvent = Event.builder()
                .id("event-200")
                .tenantId("tenant-reg-1")
                .title("Tech Conference 2026")
                .slug("tech-conf-2026")
                .status(EventState.REGISTRATION_OPEN)
                .maxCapacity(100)
                .build();

        when(eventRepository.findByIdAndTenantId("event-200", "tenant-reg-1")).thenReturn(Optional.of(mockEvent));
        when(registrationRepository.existsByTenantIdAndEventIdAndAttendeeEmailAndDeletedFalse("tenant-reg-1", "event-200", "john@example.com")).thenReturn(false);
        when(registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-reg-1", "event-200", RegistrationStatus.CONFIRMED)).thenReturn(10L);
        when(registrationRepository.save(any(Registration.class))).thenAnswer(i -> {
            Registration r = i.getArgument(0);
            r.setId("reg-999");
            return r;
        });

        RegistrationRequest request = RegistrationRequest.builder()
                .eventId("event-200")
                .attendeeName("John Doe")
                .attendeeEmail("john@example.com")
                .attendeePhone("+1234567890")
                .build();

        RegistrationResponse response = registrationService.registerAttendee(null, request);

        assertNotNull(response);
        assertEquals("John Doe", response.getAttendeeName());
        assertEquals("john@example.com", response.getAttendeeEmail());
        assertEquals(RegistrationStatus.CONFIRMED, response.getStatus());
        assertTrue(response.getRegistrationNumber().startsWith("REG-TECH-CONF-2026-"));
    }

    @Test
    void testRegisterAttendeeDraftEventFails() {
        Event mockEvent = Event.builder()
                .id("event-201")
                .tenantId("tenant-reg-1")
                .status(EventState.DRAFT)
                .build();

        when(eventRepository.findByIdAndTenantId("event-201", "tenant-reg-1")).thenReturn(Optional.of(mockEvent));

        RegistrationRequest request = RegistrationRequest.builder()
                .eventId("event-201")
                .attendeeName("Jane Doe")
                .attendeeEmail("jane@example.com")
                .build();

        assertThrows(ResourceConflictException.class, () -> registrationService.registerAttendee(null, request));
    }
}
