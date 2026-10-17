package com.eventsphere.notification.repository;

import com.eventsphere.notification.entity.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, String> {
    List<EmailLog> findByTenantIdAndNotificationId(String tenantId, String notificationId);
}
