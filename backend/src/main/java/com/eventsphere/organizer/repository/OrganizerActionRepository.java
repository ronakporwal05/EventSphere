package com.eventsphere.organizer.repository;

import com.eventsphere.organizer.entity.OrganizerAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizerActionRepository extends JpaRepository<OrganizerAction, String> {
    Page<OrganizerAction> findByTenantIdAndEventId(String tenantId, String eventId, Pageable pageable);
}
