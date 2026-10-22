package com.eventsphere.dashboard.repository;

import com.eventsphere.dashboard.entity.DashboardSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardSnapshotRepository extends JpaRepository<DashboardSnapshot, String> {
    List<DashboardSnapshot> findTop10ByTenantIdAndEventIdOrderByCreatedAtDesc(String tenantId, String eventId);
}
