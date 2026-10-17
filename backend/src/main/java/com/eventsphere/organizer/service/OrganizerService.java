package com.eventsphere.organizer.service;

import com.eventsphere.organizer.dto.*;
import com.eventsphere.registration.dto.RegistrationResponse;
import com.eventsphere.ticket.dto.TicketResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrganizerService {

    WalkInRegistrationResponse processWalkInRegistration(String currentUserId, WalkInRegistrationRequest request);

    BadgePrintResponse printBadge(String currentUserId, String registrationId, String badgeType);

    TicketResponse reissueTicket(String currentUserId, String ticketId);

    TicketResponse recoverLostTicket(String currentUserId, LostTicketRecoveryRequest request);

    Page<RegistrationResponse> searchRegistrations(String eventId, String query, Pageable pageable);
}
