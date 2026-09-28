package com.eventsphere.capacity.service;

import com.eventsphere.capacity.dto.RegistrationDashboardResponse;
import com.eventsphere.capacity.dto.RegistrationStatsResponse;
import com.eventsphere.capacity.dto.WaitlistResponse;

import java.util.List;

public interface CapacityService {

    WaitlistResponse addToWaitlist(String registrationId);

    void promoteNextWaitlistedAttendee(String eventId);

    List<WaitlistResponse> getWaitlistByEvent(String eventId);

    RegistrationStatsResponse getRegistrationStats(String eventId);

    RegistrationDashboardResponse getRegistrationDashboard(String eventId);
}
