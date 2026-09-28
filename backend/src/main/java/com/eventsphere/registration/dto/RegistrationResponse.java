package com.eventsphere.registration.dto;

import com.eventsphere.registration.entity.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {
    private String id;
    private String eventId;
    private String eventTitle;
    private String userId;
    private String attendeeName;
    private String attendeeEmail;
    private String attendeePhone;
    private String registrationNumber;
    private RegistrationStatus status;
    private Instant registrationDate;
    private String cancellationReason;
    private Instant createdAt;
}
