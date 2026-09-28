package com.eventsphere.ticket.repository;

import com.eventsphere.ticket.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, String> {
    List<TicketType> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId);
    Optional<TicketType> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    boolean existsByTenantIdAndEventIdAndNameAndDeletedFalse(String tenantId, String eventId, String name);
}
