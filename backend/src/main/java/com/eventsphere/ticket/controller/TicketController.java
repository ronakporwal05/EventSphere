package com.eventsphere.ticket.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.ticket.dto.*;
import com.eventsphere.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/types")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_TICKET_TYPE", entityType = "TICKET_TYPE")
    public ResponseEntity<ApiResponse<TicketTypeResponse>> createTicketType(@Valid @RequestBody TicketTypeRequest request) {
        TicketTypeResponse response = ticketService.createTicketType(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ticket type created successfully", response));
    }

    @GetMapping("/types/event/{eventId}")
    public ResponseEntity<ApiResponse<List<TicketTypeResponse>>> getTicketTypesByEvent(@PathVariable("eventId") String eventId) {
        List<TicketTypeResponse> list = ticketService.getTicketTypesByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/generate")
    @Auditable(action = "GENERATE_TICKET", entityType = "TICKET")
    public ResponseEntity<ApiResponse<TicketResponse>> generateTicket(@Valid @RequestBody TicketGenerateRequest request) {
        TicketResponse response = ticketService.generateTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ticket issued successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable("id") String id) {
        TicketResponse response = ticketService.getTicketById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/number/{ticketNumber}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketByNumber(@PathVariable("ticketNumber") String ticketNumber) {
        TicketResponse response = ticketService.getTicketByNumber(ticketNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<PagedResponse<TicketResponse>> getTicketsByEvent(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<TicketResponse> page = ticketService.getTicketsByEvent(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Tickets retrieved successfully"));
    }

    @PostMapping("/{id}/revoke")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "REVOKE_TICKET", entityType = "TICKET")
    public ResponseEntity<ApiResponse<TicketResponse>> revokeTicket(
            @PathVariable("id") String id,
            @RequestParam(value = "reason", required = false) String reason) {
        TicketResponse response = ticketService.revokeTicket(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Ticket revoked successfully", response));
    }

    @PostMapping("/{id}/regenerate")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "REGENERATE_TICKET", entityType = "TICKET")
    public ResponseEntity<ApiResponse<TicketResponse>> regenerateTicket(@PathVariable("id") String id) {
        TicketResponse response = ticketService.regenerateTicket(id);
        return ResponseEntity.ok(ApiResponse.success("Ticket regenerated successfully", response));
    }

    @PostMapping("/types/{ticketTypeId}/hold")
    public ResponseEntity<ApiResponse<TicketLockResponse>> holdTicket(
            @PathVariable("ticketTypeId") String ticketTypeId,
            @RequestParam(value = "userId", defaultValue = "guest-user") String userId,
            @RequestParam(value = "durationSeconds", defaultValue = "600") long durationSeconds) {
        TicketLockResponse response = ticketService.holdTicket(ticketTypeId, userId, durationSeconds);
        return ResponseEntity.ok(ApiResponse.success("Ticket hold status", response));
    }

    @DeleteMapping("/types/{ticketTypeId}/hold")
    public ResponseEntity<ApiResponse<Boolean>> releaseTicketHold(
            @PathVariable("ticketTypeId") String ticketTypeId,
            @RequestParam(value = "userId", defaultValue = "guest-user") String userId) {
        boolean released = ticketService.releaseTicketHold(ticketTypeId, userId);
        return ResponseEntity.ok(ApiResponse.success("Ticket hold released", released));
    }
}
