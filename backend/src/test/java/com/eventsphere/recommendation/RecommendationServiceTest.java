package com.eventsphere.recommendation;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.recommendation.dto.EventRecommendation;
import com.eventsphere.recommendation.dto.NetworkingRecommendation;
import com.eventsphere.recommendation.dto.SessionRecommendation;
import com.eventsphere.recommendation.repository.UserRecommendationRepository;
import com.eventsphere.recommendation.service.RecommendationServiceImpl;
import com.eventsphere.registration.repository.RegistrationRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private UserRecommendationRepository recommendationRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private RegistrationRepository registrationRepository;

    @InjectMocks
    private RecommendationServiceImpl recommendationService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-rc-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testGetRecommendedEventsSuccess() {
        Event mockEvent = Event.builder().id("evt-rc-1").tenantId("tenant-rc-1").title("AI Summit 2026").category("TECHNOLOGY").build();
        when(eventRepository.findByTenantIdAndDeletedFalse(eq("tenant-rc-1"), any())).thenReturn(new PageImpl<>(List.of(mockEvent)));

        List<EventRecommendation> recs = recommendationService.getRecommendedEvents("usr-rc-1");

        assertNotNull(recs);
        assertFalse(recs.isEmpty());
        assertEquals("evt-rc-1", recs.get(0).getEventId());
        assertEquals(0.95, recs.get(0).getMatchScore());
        verify(recommendationRepository, atLeastOnce()).save(any());
    }

    @Test
    void testGetRecommendedSessionsSuccess() {
        List<SessionRecommendation> recs = recommendationService.getRecommendedSessions("usr-rc-1", "evt-rc-1");
        assertNotNull(recs);
        assertEquals(2, recs.size());
        assertEquals("sess-101", recs.get(0).getSessionId());
    }

    @Test
    void testGetNetworkingRecommendationsSuccess() {
        when(registrationRepository.findByTenantIdAndEventIdAndStatusAndDeletedFalse(eq("tenant-rc-1"), eq("evt-rc-1"), any(), any())).thenReturn(new PageImpl<>(List.of()));

        List<NetworkingRecommendation> recs = recommendationService.getNetworkingRecommendations("usr-rc-1", "evt-rc-1");
        assertNotNull(recs);
        assertFalse(recs.isEmpty());
        assertEquals("usr-net-999", recs.get(0).getRecommendedUserId());
    }
}
