package com.eventsphere.event;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.dto.EventCreateRequest;
import com.eventsphere.event.dto.EventResponse;
import com.eventsphere.event.dto.EventStatusUpdateRequest;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.entity.EventState;
import com.eventsphere.event.repository.EventCustomFieldRepository;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.event.service.EventServiceImpl;
import com.eventsphere.venue.repository.VenueRepository;
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
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;
    @Mock
    private EventCustomFieldRepository customFieldRepository;
    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private EventServiceImpl eventService;

    private EventCreateRequest createRequest;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-test");
        createRequest = EventCreateRequest.builder()
                .title("Tech Conference 2026")
                .slug("tech-conf-2026")
                .category("Technology")
                .eventType("HYBRID")
                .capacity(500)
                .startDate(Instant.now().plusSeconds(86400))
                .endDate(Instant.now().plusSeconds(172800))
                .isPublic(true)
                .build();
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testCreateEventSuccess() {
        when(eventRepository.existsBySlugAndTenantId(anyString(), anyString())).thenReturn(false);
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> {
            Event e = i.getArgument(0);
            e.setId("evt-123");
            return e;
        });

        EventResponse response = eventService.createEvent(createRequest);

        assertNotNull(response);
        assertEquals("tech-conf-2026", response.getSlug());
        assertEquals(EventState.DRAFT, response.getStatus());
    }

    @Test
    void testValidStateTransitionDraftToReview() {
        Event event = Event.builder()
                .tenantId("tenant-test")
                .title("Tech Conference 2026")
                .status(EventState.DRAFT)
                .build();

        when(eventRepository.findByIdAndTenantId("evt-123", "tenant-test")).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> i.getArgument(0));

        EventStatusUpdateRequest statusUpdate = EventStatusUpdateRequest.builder()
                .targetState(EventState.REVIEW)
                .build();

        EventResponse response = eventService.transitionEventState("evt-123", statusUpdate);
        assertEquals(EventState.REVIEW, response.getStatus());
    }

    @Test
    void testInvalidStateTransitionDraftToCompletedThrowsException() {
        Event event = Event.builder()
                .tenantId("tenant-test")
                .title("Tech Conference 2026")
                .status(EventState.DRAFT)
                .build();

        when(eventRepository.findByIdAndTenantId("evt-123", "tenant-test")).thenReturn(Optional.of(event));

        EventStatusUpdateRequest statusUpdate = EventStatusUpdateRequest.builder()
                .targetState(EventState.COMPLETED)
                .build();

        assertThrows(ResourceConflictException.class, () -> eventService.transitionEventState("evt-123", statusUpdate));
    }
}
