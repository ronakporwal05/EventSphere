package com.eventsphere.venue.repository;

import com.eventsphere.venue.entity.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VenueRepository extends JpaRepository<Venue, String> {
    Page<Venue> findByTenantId(String tenantId, Pageable pageable);
    Optional<Venue> findByIdAndTenantId(String id, String tenantId);
}
