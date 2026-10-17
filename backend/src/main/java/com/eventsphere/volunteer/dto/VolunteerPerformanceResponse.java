package com.eventsphere.volunteer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerPerformanceResponse {
    private String id;
    private String volunteerId;
    private String volunteerName;
    private int totalScansPerformed;
    private int tasksCompleted;
    private BigDecimal rating;
    private String notes;
}
