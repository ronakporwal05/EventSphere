package com.eventsphere.ticket.service;

import com.eventsphere.ticket.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TicketService {

    TicketTypeResponse createTicketType(TicketTypeRequest request);

    List<TicketTypeResponse> getTicketTypesByEvent(String eventId);

    TicketResponse generateTicket(TicketGenerateRequest request);

    TicketResponse getTicketById(String id);

    TicketResponse getTicketByNumber(String ticketNumber);

    Page<TicketResponse> getTicketsByEvent(String eventId, Pageable pageable);

    TicketResponse revokeTicket(String id, String reason);

    TicketResponse regenerateTicket(String id);

    TicketLockResponse holdTicket(String ticketTypeId, String userId, long holdDurationSeconds);

    boolean releaseTicketHold(String ticketTypeId, String userId);
}
