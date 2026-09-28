package com.eventsphere.registration.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.registration.dto.RegistrationRequest;
import com.eventsphere.registration.dto.RegistrationResponse;
import com.eventsphere.registration.dto.RegistrationStatusUpdateRequest;
import com.eventsphere.registration.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    @Auditable(action = "REGISTER_ATTENDEE", entityType = "REGISTRATION")
    public ResponseEntity<ApiResponse<RegistrationResponse>> registerAttendee(@Valid @RequestBody RegistrationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) ? auth.getName() : null;

        RegistrationResponse response = registrationService.registerAttendee(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration completed successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegistrationResponse>> getRegistrationById(@PathVariable("id") String id) {
        RegistrationResponse response = registrationService.getRegistrationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/number/{registrationNumber}")
    public ResponseEntity<ApiResponse<RegistrationResponse>> getRegistrationByNumber(@PathVariable("registrationNumber") String registrationNumber) {
        RegistrationResponse response = registrationService.getRegistrationByNumber(registrationNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<PagedResponse<RegistrationResponse>> getRegistrationsByEvent(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<RegistrationResponse> page = registrationService.getRegistrationsByEvent(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Registrations retrieved successfully"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPDATE_REGISTRATION_STATUS", entityType = "REGISTRATION")
    public ResponseEntity<ApiResponse<RegistrationResponse>> updateRegistrationStatus(
            @PathVariable("id") String id,
            @Valid @RequestBody RegistrationStatusUpdateRequest request) {
        RegistrationResponse response = registrationService.updateRegistrationStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Registration status updated successfully", response));
    }

    @PostMapping("/{id}/cancel")
    @Auditable(action = "CANCEL_REGISTRATION", entityType = "REGISTRATION")
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(
            @PathVariable("id") String id,
            @RequestParam(value = "reason", required = false) String reason) {
        registrationService.cancelRegistration(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled successfully", null));
    }
}
