package com.eventsphere.notification.repository;

import com.eventsphere.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    Page<Notification> findByTenantIdAndStatus(String tenantId, String status, Pageable pageable);
    List<Notification> findByTenantIdAndStatusIn(String tenantId, List<String> statuses);
    long countByTenantIdAndStatus(String tenantId, String status);
}
