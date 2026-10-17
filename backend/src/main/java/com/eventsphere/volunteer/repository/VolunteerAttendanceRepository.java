package com.eventsphere.volunteer.repository;

import com.eventsphere.volunteer.entity.VolunteerAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerAttendanceRepository extends JpaRepository<VolunteerAttendance, String> {
    List<VolunteerAttendance> findByTenantIdAndVolunteerId(String tenantId, String volunteerId);
}
