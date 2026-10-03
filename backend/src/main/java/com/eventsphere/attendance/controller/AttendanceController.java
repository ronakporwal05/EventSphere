package com.eventsphere.attendance.controller;

import com.eventsphere.attendance.dto.*;
import com.eventsphere.attendance.service.AttendanceService;
import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    @Auditable(action = "ATTENDANCE_CHECK_IN", entityType = "ATTENDANCE")
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkIn(@Valid @RequestBody CheckInRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        AttendanceResponse response = attendanceService.checkIn(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attendee checked in successfully", response));
    }

    @PostMapping("/bulk-check-in")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    @Auditable(action = "BULK_ATTENDANCE_CHECK_IN", entityType = "ATTENDANCE")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> bulkCheckIn(@Valid @RequestBody BulkCheckInRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<AttendanceResponse> response = attendanceService.bulkCheckIn(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bulk check-in executed successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getAttendanceById(@PathVariable("id") String id) {
        AttendanceResponse response = attendanceService.getAttendanceById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER') or hasRole('STAFF')")
    public ResponseEntity<PagedResponse<AttendanceResponse>> searchAttendance(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<AttendanceResponse> page = attendanceService.searchAttendance(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Attendance records retrieved successfully"));
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<List<AttendanceLogResponse>>> getAttendanceHistory(@PathVariable("id") String id) {
        List<AttendanceLogResponse> history = attendanceService.getAttendanceHistory(id);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "ATTENDANCE_CORRECTION", entityType = "ATTENDANCE")
    public ResponseEntity<ApiResponse<AttendanceResponse>> updateAttendanceStatus(
            @PathVariable("id") String id,
            @Valid @RequestBody AttendanceCorrectionRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        AttendanceResponse response = attendanceService.updateAttendanceStatus(currentUserId, id, request);
        return ResponseEntity.ok(ApiResponse.success("Attendance status corrected", response));
    }
}
