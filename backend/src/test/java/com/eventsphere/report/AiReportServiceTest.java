package com.eventsphere.report;

import com.eventsphere.ai.provider.LlmProvider;
import com.eventsphere.attendance.repository.AttendanceRepository;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.registration.entity.RegistrationStatus;
import com.eventsphere.registration.repository.RegistrationRepository;
import com.eventsphere.report.dto.ReportGenerateRequest;
import com.eventsphere.report.dto.ReportResponse;
import com.eventsphere.report.entity.AiReport;
import com.eventsphere.report.repository.AiReportRepository;
import com.eventsphere.report.service.AiReportServiceImpl;
import com.eventsphere.volunteer.repository.VolunteerRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiReportServiceTest {

    @Mock
    private AiReportRepository reportRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private RegistrationRepository registrationRepository;
    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private VolunteerRepository volunteerRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LlmProvider llmProvider;

    @InjectMocks
    private AiReportServiceImpl reportService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-rep-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testGenerateReportSuccess() {
        Event mockEvent = Event.builder().id("evt-rep-1").tenantId("tenant-rep-1").title("Tech Conference 2026").maxCapacity(500).build();
        User mockUser = User.builder().id("usr-rep-1").email("exec@eventsphere.ai").build();

        when(eventRepository.findByIdAndTenantId("evt-rep-1", "tenant-rep-1")).thenReturn(Optional.of(mockEvent));
        when(userRepository.findById("usr-rep-1")).thenReturn(Optional.of(mockUser));
        when(registrationRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-rep-1", "evt-rep-1", RegistrationStatus.CONFIRMED)).thenReturn(450L);
        when(attendanceRepository.countByTenantIdAndEventIdAndStatusAndDeletedFalse("tenant-rep-1", "evt-rep-1", "CHECKED_IN")).thenReturn(410L);
        when(volunteerRepository.findByTenantIdAndEventIdAndDeletedFalse(eq("tenant-rep-1"), eq("evt-rep-1"), any())).thenReturn(new PageImpl<>(List.of()));

        when(llmProvider.generateCompletion(anyString(), anyString())).thenReturn(new LlmProvider.LlmResponse("Event achieved a 91% attendance conversion rate.", 200, 50));

        when(reportRepository.save(any(AiReport.class))).thenAnswer(i -> {
            AiReport r = i.getArgument(0);
            r.setId("rep-999");
            return r;
        });

        ReportGenerateRequest request = ReportGenerateRequest.builder()
                .eventId("evt-rep-1")
                .reportType("POST_EVENT_SUMMARY")
                .build();

        ReportResponse response = reportService.generateReport("usr-rep-1", request);

        assertNotNull(response);
        assertEquals("rep-999", response.getId());
        assertEquals("POST_EVENT_SUMMARY", response.getReportType());
        assertTrue(response.getMarkdownContent().contains("Tech Conference 2026"));
        verify(reportRepository, times(1)).save(any(AiReport.class));
    }
}
