package com.eventsphere.session.repository;

import com.eventsphere.session.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    List<Session> findByTenantIdAndEventId(String tenantId, String eventId);
    Optional<Session> findByIdAndTenantId(String id, String tenantId);

    @Query("SELECT s FROM Session s WHERE s.tenantId = :tenantId AND s.room.id = :roomId AND " +
           "((s.startTime < :endTime AND s.endTime > :startTime))")
    List<Session> findConflictingRoomSessions(
            @Param("tenantId") String tenantId,
            @Param("roomId") String roomId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime);
}
