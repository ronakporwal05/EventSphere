package com.eventsphere.organizer.dto;

import com.eventsphere.attendance.dto.AttendanceResponse;
import com.eventsphere.registration.dto.RegistrationResponse;
import com.eventsphere.ticket.dto.TicketResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalkInRegistrationResponse {
    private RegistrationResponse registration;
    private TicketResponse ticket;
    private AttendanceResponse attendance;
    private String message;
}
