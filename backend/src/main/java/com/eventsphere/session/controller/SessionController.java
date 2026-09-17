package com.eventsphere.session.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.session.dto.SessionCreateRequest;
import com.eventsphere.session.dto.SessionResponse;
import com.eventsphere.session.dto.SpeakerAssignRequest;
import com.eventsphere.session.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_SESSION", entityType = "SESSION")
    public ResponseEntity<ApiResponse<SessionResponse>> createSession(@Valid @RequestBody SessionCreateRequest request) {
        SessionResponse response = sessionService.createSession(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Session created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SessionResponse>> getSessionById(@PathVariable("id") String id) {
        SessionResponse response = sessionService.getSessionById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<SessionResponse>>> getSessionsByEvent(@PathVariable("eventId") String eventId) {
        List<SessionResponse> sessions = sessionService.getSessionsByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(sessions));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPDATE_SESSION", entityType = "SESSION")
    public ResponseEntity<ApiResponse<SessionResponse>> updateSession(@PathVariable("id") String id, @Valid @RequestBody SessionCreateRequest request) {
        SessionResponse response = sessionService.updateSession(id, request);
        return ResponseEntity.ok(ApiResponse.success("Session updated successfully", response));
    }

    @PostMapping("/{id}/speakers")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "ASSIGN_SPEAKERS", entityType = "SESSION")
    public ResponseEntity<ApiResponse<SessionResponse>> assignSpeakers(@PathVariable("id") String id, @Valid @RequestBody SpeakerAssignRequest request) {
        SessionResponse response = sessionService.assignSpeakers(id, request);
        return ResponseEntity.ok(ApiResponse.success("Speakers assigned successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "DELETE_SESSION", entityType = "SESSION")
    public ResponseEntity<ApiResponse<Void>> deleteSession(@PathVariable("id") String id) {
        sessionService.deleteSession(id);
        return ResponseEntity.ok(ApiResponse.success("Session deleted successfully", null));
    }
}
