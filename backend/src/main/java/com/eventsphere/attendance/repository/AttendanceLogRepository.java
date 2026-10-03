package com.eventsphere.attendance.repository;

import com.eventsphere.attendance.entity.AttendanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, String> {
    List<AttendanceLog> findByTenantIdAndAttendanceIdOrderByCreatedAtDesc(String tenantId, String attendanceId);
}
