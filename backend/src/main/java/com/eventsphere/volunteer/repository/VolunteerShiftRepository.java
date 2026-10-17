package com.eventsphere.volunteer.repository;

import com.eventsphere.volunteer.entity.VolunteerShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface VolunteerShiftRepository extends JpaRepository<VolunteerShift, String> {
    List<VolunteerShift> findByTenantIdAndVolunteerId(String tenantId, String volunteerId);

    @Query("SELECT COUNT(s) FROM VolunteerShift s WHERE s.tenantId = :tenantId AND s.volunteer.id = :volunteerId AND s.status != 'CANCELLED' AND ((s.startTime < :endTime AND s.endTime > :startTime))")
    long countOverlappingShifts(@Param("tenantId") String tenantId, @Param("volunteerId") String volunteerId, @Param("startTime") Instant startTime, @Param("endTime") Instant endTime);
}
