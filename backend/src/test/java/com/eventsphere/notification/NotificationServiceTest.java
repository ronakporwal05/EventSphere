package com.eventsphere.notification;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.notification.dto.NotificationSendRequest;
import com.eventsphere.notification.dto.NotificationResponse;
import com.eventsphere.notification.entity.EmailLog;
import com.eventsphere.notification.entity.Notification;
import com.eventsphere.notification.provider.EmailProvider;
import com.eventsphere.notification.provider.PushProvider;
import com.eventsphere.notification.repository.AnnouncementRepository;
import com.eventsphere.notification.repository.EmailLogRepository;
import com.eventsphere.notification.repository.NotificationRepository;
import com.eventsphere.notification.service.NotificationServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private EmailLogRepository emailLogRepository;
    @Mock
    private AnnouncementRepository announcementRepository;
    @Mock
    private EmailProvider emailProvider;
    @Mock
    private PushProvider pushProvider;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-notif-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testSendNotificationQueuedSuccess() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> {
            Notification n = i.getArgument(0);
            n.setId("notif-111");
            return n;
        });

        NotificationSendRequest request = NotificationSendRequest.builder()
                .recipientEmail("user@eventsphere.ai")
                .recipientName("Alice Smith")
                .subject("Registration Confirmation")
                .content("Thank you for registering.")
                .type("EMAIL")
                .build();

        NotificationResponse response = notificationService.sendNotification(request);

        assertNotNull(response);
        assertEquals("PENDING", response.getStatus());
        assertEquals("user@eventsphere.ai", response.getRecipientEmail());
    }

    @Test
    void testDispatchNotificationAsyncSuccess() {
        Notification mockNotif = Notification.builder()
                .id("notif-222")
                .tenantId("tenant-notif-1")
                .recipientEmail("bob@eventsphere.ai")
                .subject("Certificate Ready")
                .content("Your certificate is ready.")
                .type("EMAIL")
                .status("PENDING")
                .build();

        when(notificationRepository.findById("notif-222")).thenReturn(Optional.of(mockNotif));
        when(emailProvider.sendEmail("bob@eventsphere.ai", "Certificate Ready", "Your certificate is ready.")).thenReturn(true);
        when(emailProvider.getProviderName()).thenReturn("DEFAULT_SMTP_MOCK");

        notificationService.dispatchNotificationAsync("notif-222", "tenant-notif-1");

        assertEquals("SENT", mockNotif.getStatus());
        verify(emailLogRepository, times(1)).save(any(EmailLog.class));
    }
}
