package com.eventsphere.organizer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadgePrintResponse {
    private String id;
    private String registrationId;
    private String attendeeName;
    private String attendeeEmail;
    private String badgeType;
    private int printCount;
    private String zplCode; // Thermal printer ZPL command string
    private Instant lastPrintedAt;
}
