package com.eventsphere.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceLogResponse {
    private String id;
    private String attendanceId;
    private String action;
    private String performedByEmail;
    private String details;
    private Instant createdAt;
}
