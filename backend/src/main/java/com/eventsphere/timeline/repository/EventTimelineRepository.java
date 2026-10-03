package com.eventsphere.timeline.repository;

import com.eventsphere.timeline.entity.EventTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventTimelineRepository extends JpaRepository<EventTimeline, String> {
    List<EventTimeline> findByTenantIdAndEventIdAndDeletedFalseOrderByDisplayOrderAscMilestoneDateAsc(String tenantId, String eventId);
}
