package com.eventsphere.attendance.repository;

import com.eventsphere.attendance.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    Page<Attendance> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    Optional<Attendance> findByIdAndTenantIdAndDeletedFalse(String id, String tenantId);
    Optional<Attendance> findByTenantIdAndTicketIdAndDeletedFalse(String tenantId, String ticketId);
    boolean existsByTenantIdAndEventIdAndTicketIdAndDeletedFalse(String tenantId, String eventId, String ticketId);
    long countByTenantIdAndEventIdAndStatusAndDeletedFalse(String tenantId, String eventId, String status);
}
