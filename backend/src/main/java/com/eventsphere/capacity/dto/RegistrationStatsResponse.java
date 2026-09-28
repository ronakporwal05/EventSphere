package com.eventsphere.capacity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationStatsResponse {
    private String eventId;
    private Integer maxCapacity;
    private long totalConfirmed;
    private long totalPending;
    private long totalCancelled;
    private long totalWaitlisted;
    private double occupancyRatePercentage;
}
