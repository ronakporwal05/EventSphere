package com.eventsphere.event.service;

import com.eventsphere.event.dto.EventCreateRequest;
import com.eventsphere.event.dto.EventResponse;
import com.eventsphere.event.dto.EventStatusUpdateRequest;
import com.eventsphere.event.dto.EventUpdateRequest;
import com.eventsphere.event.entity.EventState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventService {

    EventResponse createEvent(EventCreateRequest request);

    EventResponse getEventById(String id);

    EventResponse getEventBySlug(String slug);

    Page<EventResponse> getAllEvents(EventState status, Pageable pageable);

    EventResponse updateEvent(String id, EventUpdateRequest request);

    EventResponse transitionEventState(String id, EventStatusUpdateRequest request);

    EventResponse cloneEvent(String id, String newTitle, String newSlug);

    void deleteEvent(String id);
}
