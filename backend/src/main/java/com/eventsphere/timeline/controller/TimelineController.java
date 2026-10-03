package com.eventsphere.timeline.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.timeline.dto.TimelineRequest;
import com.eventsphere.timeline.dto.TimelineResponse;
import com.eventsphere.timeline.service.TimelineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/timelines")
@RequiredArgsConstructor
public class TimelineController {

    private final TimelineService timelineService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "ADD_MILESTONE", entityType = "TIMELINE")
    public ResponseEntity<ApiResponse<TimelineResponse>> addMilestone(@Valid @RequestBody TimelineRequest request) {
        TimelineResponse response = timelineService.addMilestone(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Milestone added successfully", response));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<TimelineResponse>>> getTimelinesByEvent(@PathVariable("eventId") String eventId) {
        List<TimelineResponse> list = timelineService.getTimelinesByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "DELETE_MILESTONE", entityType = "TIMELINE")
    public ResponseEntity<ApiResponse<Void>> deleteMilestone(@PathVariable("id") String id) {
        timelineService.deleteMilestone(id);
        return ResponseEntity.ok(ApiResponse.success("Milestone deleted successfully", null));
    }
}
