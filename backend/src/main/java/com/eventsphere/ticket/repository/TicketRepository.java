package com.eventsphere.ticket.repository;

import com.eventsphere.ticket.entity.Ticket;
import com.eventsphere.ticket.entity.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, String> {
    Page<Ticket> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    Optional<Ticket> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    Optional<Ticket> findByTenantIdAndTicketNumberAndDeletedFalse(String tenantId, String ticketNumber);
    List<Ticket> findByTenantIdAndRegistrationIdAndDeletedFalse(String tenantId, String registrationId);
    long countByTenantIdAndEventIdAndStatusAndDeletedFalse(String tenantId, String eventId, TicketStatus status);
}
