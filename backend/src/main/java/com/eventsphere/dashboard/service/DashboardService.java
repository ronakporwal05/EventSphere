package com.eventsphere.dashboard.service;

import com.eventsphere.dashboard.dto.LiveDashboardResponse;

public interface DashboardService {

    LiveDashboardResponse getLiveEventDashboard(String eventId);

    void captureDashboardSnapshot(String eventId);
}
