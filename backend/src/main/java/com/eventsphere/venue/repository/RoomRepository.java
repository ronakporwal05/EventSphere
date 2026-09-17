package com.eventsphere.venue.repository;

import com.eventsphere.venue.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    List<Room> findByTenantIdAndVenueId(String tenantId, String venueId);
    Optional<Room> findByIdAndTenantId(String id, String tenantId);
}
