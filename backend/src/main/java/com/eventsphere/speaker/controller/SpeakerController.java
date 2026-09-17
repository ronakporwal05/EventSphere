package com.eventsphere.speaker.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.speaker.dto.SpeakerRequest;
import com.eventsphere.speaker.dto.SpeakerResponse;
import com.eventsphere.speaker.service.SpeakerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/speakers")
@RequiredArgsConstructor
public class SpeakerController {

    private final SpeakerService speakerService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_SPEAKER", entityType = "SPEAKER")
    public ResponseEntity<ApiResponse<SpeakerResponse>> createSpeaker(@Valid @RequestBody SpeakerRequest request) {
        SpeakerResponse response = speakerService.createSpeaker(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Speaker created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SpeakerResponse>> getSpeakerById(@PathVariable("id") String id) {
        SpeakerResponse response = speakerService.getSpeakerById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<SpeakerResponse>> getSpeakers(Pageable pageable) {
        Page<SpeakerResponse> page = speakerService.getSpeakers(pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Speakers retrieved successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPDATE_SPEAKER", entityType = "SPEAKER")
    public ResponseEntity<ApiResponse<SpeakerResponse>> updateSpeaker(@PathVariable("id") String id, @Valid @RequestBody SpeakerRequest request) {
        SpeakerResponse response = speakerService.updateSpeaker(id, request);
        return ResponseEntity.ok(ApiResponse.success("Speaker updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "DELETE_SPEAKER", entityType = "SPEAKER")
    public ResponseEntity<ApiResponse<Void>> deleteSpeaker(@PathVariable("id") String id) {
        speakerService.deleteSpeaker(id);
        return ResponseEntity.ok(ApiResponse.success("Speaker deleted successfully", null));
    }
}
