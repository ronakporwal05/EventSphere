package com.eventsphere.analytics;

import com.eventsphere.ai.provider.LlmProvider;
import com.eventsphere.analytics.dto.AiAnalyticsInsights;
import com.eventsphere.analytics.entity.AiAnalyticsInsightEntity;
import com.eventsphere.analytics.repository.AiAnalyticsInsightRepository;
import com.eventsphere.analytics.service.AiAnalyticsServiceImpl;
import com.eventsphere.attendance.repository.AttendanceRepository;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
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
class AiAnalyticsServiceTest {

    @Mock
    private EventRepository eventRepository;
    @Mock
    private RegistrationRepository registrationRepository;
    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private AiAnalyticsInsightRepository insightRepository;
    @Mock
    private LlmProvider llmProvider;

    @InjectMocks
    private AiAnalyticsServiceImpl analyticsService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-an-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testGenerateEventPredictiveAnalyticsSuccess() {
        Event mockEvent = Event.builder().id("evt-an-1").tenantId("tenant-an-1").title("AI & Cloud Expo").maxCapacity(1000).build();

        when(eventRepository.findByIdAndTenantId("evt-an-1", "tenant-an-1")).thenReturn(Optional.of(mockEvent));
        when(registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-an-1", "evt-an-1", RegistrationStatus.CONFIRMED)).thenReturn(950L);
        when(attendanceRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-an-1", "evt-an-1", "CHECKED_IN")).thenReturn(400L);

        when(llmProvider.generateCompletion(anyString(), anyString())).thenReturn(new LlmProvider.LlmResponse("High attendance expected. Venue capacity is at 95%.", 100, 20));

        AiAnalyticsInsights insights = analyticsService.generateEventPredictiveAnalytics("evt-an-1");

        assertNotNull(insights);
        assertEquals(950, insights.getTotalRegistrations());
        assertEquals(808, insights.getPredictedAttendanceCount()); // 950 * 0.85 = 807.5 -> 808
        assertEquals("HIGH", insights.getCapacityRiskLevel());
        verify(insightRepository, times(1)).save(any(AiAnalyticsInsightEntity.class));
    }
}
