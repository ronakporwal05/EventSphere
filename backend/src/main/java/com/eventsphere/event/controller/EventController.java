package com.eventsphere.event.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.event.dto.*;
import com.eventsphere.event.entity.EventState;
import com.eventsphere.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_EVENT", entityType = "EVENT")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventCreateRequest request) {
        EventResponse response = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable("id") String id) {
        EventResponse response = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/public/slug/{slug}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventBySlug(@PathVariable("slug") String slug) {
        EventResponse response = eventService.getEventBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<EventResponse>> getAllEvents(
            @RequestParam(name = "status", required = false) EventState status,
            Pageable pageable) {
        Page<EventResponse> events = eventService.getAllEvents(status, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(events, "Events retrieved successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPDATE_EVENT", entityType = "EVENT")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(@PathVariable("id") String id, @Valid @RequestBody EventUpdateRequest request) {
        EventResponse response = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", response));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "TRANSITION_EVENT_STATE", entityType = "EVENT")
    public ResponseEntity<ApiResponse<EventResponse>> transitionEventState(@PathVariable("id") String id, @Valid @RequestBody EventStatusUpdateRequest request) {
        EventResponse response = eventService.transitionEventState(id, request);
        return ResponseEntity.ok(ApiResponse.success("Event status updated successfully to " + request.getTargetState(), response));
    }

    @PostMapping("/{id}/clone")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CLONE_EVENT", entityType = "EVENT")
    public ResponseEntity<ApiResponse<EventResponse>> cloneEvent(
            @PathVariable("id") String id,
            @RequestParam("newTitle") String newTitle,
            @RequestParam("newSlug") String newSlug) {
        EventResponse response = eventService.cloneEvent(id, newTitle, newSlug);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event cloned successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "DELETE_EVENT", entityType = "EVENT")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable("id") String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
