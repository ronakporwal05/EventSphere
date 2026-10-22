package com.eventsphere.capacity;

import com.eventsphere.capacity.dto.RegistrationStatsResponse;
import com.eventsphere.capacity.dto.WaitlistResponse;
import com.eventsphere.capacity.entity.WaitlistEntry;
import com.eventsphere.capacity.repository.WaitlistRepository;
import com.eventsphere.capacity.service.CapacityServiceImpl;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.entity.RegistrationStatus;
import com.eventsphere.registration.repository.RegistrationRepository;
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
class CapacityServiceTest {

    @Mock
    private WaitlistRepository waitlistRepository;
    @Mock
    private RegistrationRepository registrationRepository;
    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private CapacityServiceImpl capacityService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-cap-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testAddToWaitlistSuccess() {
        Event mockEvent = Event.builder().id("evt-cap-1").tenantId("tenant-cap-1").maxCapacity(100).build();

        Registration mockReg = Registration.builder()
                .id("reg-cap-1")
                .tenantId("tenant-cap-1")
                .event(mockEvent)
                .attendeeName("David Miller")
                .attendeeEmail("david@miller.com")
                .status(RegistrationStatus.PENDING)
                .build();

        when(registrationRepository.findByIdAndTenantIdAndDeletedFalse("reg-cap-1", "tenant-cap-1")).thenReturn(Optional.of(mockReg));
        when(waitlistRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-cap-1", "evt-cap-1", "WAITING")).thenReturn(4L);
        when(waitlistRepository.save(any(WaitlistEntry.class))).thenAnswer(i -> {
            WaitlistEntry w = i.getArgument(0);
            w.setId("wl-555");
            return w;
        });

        WaitlistResponse response = capacityService.addToWaitlist("reg-cap-1");

        assertNotNull(response);
        assertEquals(5, response.getPosition());
        assertEquals(RegistrationStatus.WAITLISTED, mockReg.getStatus());
    }

    @Test
    void testGetRegistrationStatsSuccess() {
        Event mockEvent = Event.builder().id("evt-cap-2").tenantId("tenant-cap-1").maxCapacity(200).build();

        when(eventRepository.findByIdAndTenantId("evt-cap-2", "tenant-cap-1")).thenReturn(Optional.of(mockEvent));
        when(registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-cap-1", "evt-cap-2", RegistrationStatus.CONFIRMED)).thenReturn(150L);
        when(registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-cap-1", "evt-cap-2", RegistrationStatus.PENDING)).thenReturn(20L);
        when(registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-cap-1", "evt-cap-2", RegistrationStatus.CANCELLED)).thenReturn(5L);
        when(waitlistRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-cap-1", "evt-cap-2", "WAITING")).thenReturn(15L);

        RegistrationStatsResponse stats = capacityService.getRegistrationStats("evt-cap-2");

        assertNotNull(stats);
        assertEquals(200, stats.getMaxCapacity());
        assertEquals(150, stats.getTotalConfirmed());
        assertEquals(75.0, stats.getOccupancyRatePercentage());
    }
}
