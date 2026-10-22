package com.eventsphere.dashboard;

import com.eventsphere.attendance.repository.AttendanceRepository;
import com.eventsphere.certificate.repository.CertificateRepository;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.dashboard.dto.LiveDashboardResponse;
import com.eventsphere.dashboard.repository.DashboardSnapshotRepository;
import com.eventsphere.dashboard.service.DashboardServiceImpl;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.notification.repository.AnnouncementRepository;
import com.eventsphere.notification.repository.NotificationRepository;
import com.eventsphere.registration.entity.RegistrationStatus;
import com.eventsphere.registration.repository.RegistrationRepository;
import com.eventsphere.volunteer.repository.VolunteerRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private EventRepository eventRepository;
    @Mock
    private RegistrationRepository registrationRepository;
    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private VolunteerRepository volunteerRepository;
    @Mock
    private CertificateRepository certificateRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private AnnouncementRepository announcementRepository;
    @Mock
    private DashboardSnapshotRepository snapshotRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-dash-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testGetLiveEventDashboardSuccess() {
        Event mockEvent = Event.builder().id("evt-dash-1").tenantId("tenant-dash-1").title("Global AI Summit").maxCapacity(1000).build();

        when(eventRepository.findByIdAndTenantId("evt-dash-1", "tenant-dash-1")).thenReturn(Optional.of(mockEvent));
        when(registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-dash-1", "evt-dash-1", RegistrationStatus.CONFIRMED)).thenReturn(800L);
        when(attendanceRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-dash-1", "evt-dash-1", "CHECKED_IN")).thenReturn(600L);
        when(volunteerRepository.findByTenantIdAndEventIdAndDeletedFalse(eq("tenant-dash-1"), eq("evt-dash-1"), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));
        when(notificationRepository.countByTenantIdAndStatus("tenant-dash-1", "PENDING")).thenReturn(5L);
        when(announcementRepository.findByTenantIdAndEventIdAndDeletedFalse(eq("tenant-dash-1"), eq("evt-dash-1"), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));

        LiveDashboardResponse response = dashboardService.getLiveEventDashboard("evt-dash-1");

        assertNotNull(response);
        assertEquals(800, response.getLiveRegistrationCount());
        assertEquals(600, response.getLiveAttendanceCount());
        assertEquals(200, response.getRemainingCapacity());
        assertEquals(75.0, response.getCheckInPercentage());
    }
}
