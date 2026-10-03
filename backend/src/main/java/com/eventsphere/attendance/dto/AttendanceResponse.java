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
public class AttendanceResponse {
    private String id;
    private String eventId;
    private String registrationId;
    private String attendeeName;
    private String attendeeEmail;
    private String ticketId;
    private String ticketNumber;
    private String ticketTypeName;
    private Instant checkInTime;
    private String checkInMethod;
    private String checkedInByEmail;
    private String status;
    private String notes;
    private Instant createdAt;
}
