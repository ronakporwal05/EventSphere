package com.eventsphere.dashboard.dto;

import com.eventsphere.notification.dto.AnnouncementResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveDashboardResponse {
    private String eventId;
    private String eventTitle;
    private int maxCapacity;
    private long liveRegistrationCount;
    private long liveAttendanceCount;
    private long remainingCapacity;
    private double checkInPercentage;
    private long activeVolunteersCount;
    private long pendingCertificatesCount;
    private long pendingNotificationsCount;
    private List<AnnouncementResponse> recentAnnouncements;
    private Instant lastUpdated;
}
