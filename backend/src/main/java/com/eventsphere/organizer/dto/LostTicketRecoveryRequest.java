package com.eventsphere.organizer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LostTicketRecoveryRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Attendee email is required")
    @Email(message = "Invalid email format")
    private String attendeeEmail;
}
