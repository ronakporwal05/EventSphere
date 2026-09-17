package com.eventsphere.venue.service;

import com.eventsphere.venue.dto.RoomRequest;
import com.eventsphere.venue.dto.RoomResponse;
import com.eventsphere.venue.dto.VenueRequest;
import com.eventsphere.venue.dto.VenueResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VenueService {

    VenueResponse createVenue(VenueRequest request);

    VenueResponse getVenueById(String id);

    Page<VenueResponse> getAllVenues(Pageable pageable);

    VenueResponse updateVenue(String id, VenueRequest request);

    void deleteVenue(String id);

    RoomResponse addRoom(String venueId, RoomRequest request);

    List<RoomResponse> getRoomsByVenue(String venueId);

    void deleteRoom(String venueId, String roomId);
}
