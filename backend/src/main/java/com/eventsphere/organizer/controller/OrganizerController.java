package com.eventsphere.organizer.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.organizer.dto.*;
import com.eventsphere.organizer.service.OrganizerService;
import com.eventsphere.registration.dto.RegistrationResponse;
import com.eventsphere.ticket.dto.TicketResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/organizer")
@RequiredArgsConstructor
public class OrganizerController {

    private final OrganizerService organizerService;

    @PostMapping("/walk-in")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    @Auditable(action = "WALK_IN_REGISTRATION", entityType = "REGISTRATION")
    public ResponseEntity<ApiResponse<WalkInRegistrationResponse>> processWalkInRegistration(@Valid @RequestBody WalkInRegistrationRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        WalkInRegistrationResponse response = organizerService.processWalkInRegistration(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Walk-in registration completed successfully", response));
    }

    @PostMapping("/badges/print/{registrationId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    @Auditable(action = "PRINT_BADGE", entityType = "PRINTED_BADGE")
    public ResponseEntity<ApiResponse<BadgePrintResponse>> printBadge(
            @PathVariable("registrationId") String registrationId,
            @RequestParam(value = "badgeType", required = false) String badgeType) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        BadgePrintResponse response = organizerService.printBadge(currentUserId, registrationId, badgeType);
        return ResponseEntity.ok(ApiResponse.success("Badge print job dispatched", response));
    }

    @PostMapping("/tickets/{ticketId}/reissue")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "REISSUE_TICKET", entityType = "TICKET")
    public ResponseEntity<ApiResponse<TicketResponse>> reissueTicket(@PathVariable("ticketId") String ticketId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        TicketResponse response = organizerService.reissueTicket(currentUserId, ticketId);
        return ResponseEntity.ok(ApiResponse.success("Ticket reissued successfully", response));
    }

    @PostMapping("/tickets/recover-lost")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    @Auditable(action = "RECOVER_LOST_TICKET", entityType = "TICKET")
    public ResponseEntity<ApiResponse<TicketResponse>> recoverLostTicket(@Valid @RequestBody LostTicketRecoveryRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        TicketResponse response = organizerService.recoverLostTicket(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Lost ticket recovered and dispatched via email", response));
    }

    @GetMapping("/registrations/search/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    public ResponseEntity<PagedResponse<RegistrationResponse>> searchRegistrations(
            @PathVariable("eventId") String eventId,
            @RequestParam(value = "query", required = false) String query,
            Pageable pageable) {
        Page<RegistrationResponse> page = organizerService.searchRegistrations(eventId, query, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Registrations retrieved successfully"));
    }
}
