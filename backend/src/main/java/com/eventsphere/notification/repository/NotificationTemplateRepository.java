package com.eventsphere.notification.repository;

import com.eventsphere.notification.entity.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, String> {
    Optional<NotificationTemplate> findByTenantIdAndCodeAndDeletedFalse(String tenantId, String code);
}
