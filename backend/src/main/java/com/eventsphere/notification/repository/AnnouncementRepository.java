package com.eventsphere.notification.repository;

import com.eventsphere.notification.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, String> {
    Page<Announcement> findByTenantIdAndEventIdAndDeletedFalse(String tenantId, String eventId, Pageable pageable);
    List<Announcement> findByTenantIdAndEventIdAndCategoryAndDeletedFalse(String tenantId, String eventId, String category);
}
