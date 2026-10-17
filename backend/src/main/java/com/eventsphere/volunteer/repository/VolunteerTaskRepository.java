package com.eventsphere.volunteer.repository;

import com.eventsphere.volunteer.entity.VolunteerTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerTaskRepository extends JpaRepository<VolunteerTask, String> {
    List<VolunteerTask> findByTenantIdAndVolunteerId(String tenantId, String volunteerId);
    long countByTenantIdAndVolunteerIdAndStatus(String tenantId, String volunteerId, String status);
}
