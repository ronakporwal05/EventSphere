package com.eventsphere.venue.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.venue.dto.RoomRequest;
import com.eventsphere.venue.dto.RoomResponse;
import com.eventsphere.venue.dto.VenueRequest;
import com.eventsphere.venue.dto.VenueResponse;
import com.eventsphere.venue.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_VENUE", entityType = "VENUE")
    public ResponseEntity<ApiResponse<VenueResponse>> createVenue(@Valid @RequestBody VenueRequest request) {
        VenueResponse response = venueService.createVenue(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Venue created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VenueResponse>> getVenueById(@PathVariable("id") String id) {
        VenueResponse response = venueService.getVenueById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<VenueResponse>> getAllVenues(Pageable pageable) {
        Page<VenueResponse> page = venueService.getAllVenues(pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Venues retrieved successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPDATE_VENUE", entityType = "VENUE")
    public ResponseEntity<ApiResponse<VenueResponse>> updateVenue(@PathVariable("id") String id, @Valid @RequestBody VenueRequest request) {
        VenueResponse response = venueService.updateVenue(id, request);
        return ResponseEntity.ok(ApiResponse.success("Venue updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "DELETE_VENUE", entityType = "VENUE")
    public ResponseEntity<ApiResponse<Void>> deleteVenue(@PathVariable("id") String id) {
        venueService.deleteVenue(id);
        return ResponseEntity.ok(ApiResponse.success("Venue deleted successfully", null));
    }

    @PostMapping("/{venueId}/rooms")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "ADD_ROOM", entityType = "ROOM")
    public ResponseEntity<ApiResponse<RoomResponse>> addRoom(@PathVariable("venueId") String venueId, @Valid @RequestBody RoomRequest request) {
        RoomResponse response = venueService.addRoom(venueId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Room added successfully", response));
    }

    @GetMapping("/{venueId}/rooms")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getRoomsByVenue(@PathVariable("venueId") String venueId) {
        List<RoomResponse> rooms = venueService.getRoomsByVenue(venueId);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    @DeleteMapping("/{venueId}/rooms/{roomId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "DELETE_ROOM", entityType = "ROOM")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable("venueId") String venueId, @PathVariable("roomId") String roomId) {
        venueService.deleteRoom(venueId, roomId);
        return ResponseEntity.ok(ApiResponse.success("Room deleted successfully", null));
    }
}
