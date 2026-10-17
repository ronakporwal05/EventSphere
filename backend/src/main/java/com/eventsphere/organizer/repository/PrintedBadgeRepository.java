package com.eventsphere.organizer.repository;

import com.eventsphere.organizer.entity.PrintedBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrintedBadgeRepository extends JpaRepository<PrintedBadge, String> {
    Optional<PrintedBadge> findByTenantIdAndRegistrationId(String tenantId, String registrationId);
}
