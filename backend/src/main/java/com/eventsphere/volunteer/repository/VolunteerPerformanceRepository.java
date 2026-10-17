package com.eventsphere.volunteer.repository;

import com.eventsphere.volunteer.entity.VolunteerPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VolunteerPerformanceRepository extends JpaRepository<VolunteerPerformance, String> {
    Optional<VolunteerPerformance> findByTenantIdAndVolunteerId(String tenantId, String volunteerId);
}
