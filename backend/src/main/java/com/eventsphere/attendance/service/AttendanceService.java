package com.eventsphere.attendance.service;

import com.eventsphere.attendance.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AttendanceService {

    AttendanceResponse checkIn(String checkedInByUserId, CheckInRequest request);

    List<AttendanceResponse> bulkCheckIn(String checkedInByUserId, BulkCheckInRequest request);

    AttendanceResponse getAttendanceById(String id);

    Page<AttendanceResponse> searchAttendance(String eventId, Pageable pageable);

    List<AttendanceLogResponse> getAttendanceHistory(String attendanceId);

    AttendanceResponse updateAttendanceStatus(String currentUserId, String id, AttendanceCorrectionRequest request);
}
