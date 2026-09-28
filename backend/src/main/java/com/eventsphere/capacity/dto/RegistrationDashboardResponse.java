package com.eventsphere.capacity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDashboardResponse {
    private RegistrationStatsResponse stats;
    private List<WaitlistResponse> recentWaitlist;
}
