package com.eventsphere.venue.service;

import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.venue.dto.RoomRequest;
import com.eventsphere.venue.dto.RoomResponse;
import com.eventsphere.venue.dto.VenueRequest;
import com.eventsphere.venue.dto.VenueResponse;
import com.eventsphere.venue.entity.Room;
import com.eventsphere.venue.entity.Venue;
import com.eventsphere.venue.repository.RoomRepository;
import com.eventsphere.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;
    private final RoomRepository roomRepository;

    @Override
    @Transactional
    public VenueResponse createVenue(VenueRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating venue '{}' for tenant '{}'", request.getName(), tenantId);

        Venue venue = Venue.builder()
                .tenantId(tenantId)
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .capacity(request.getCapacity())
                .virtual(request.isVirtual())
                .virtualUrl(request.getVirtualUrl())
                .build();

        Venue saved = venueRepository.save(venue);
        return mapToVenueResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public VenueResponse getVenueById(String id) {
        String tenantId = TenantContext.getTenantId();
        Venue venue = venueRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + id));
        return mapToVenueResponse(venue);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VenueResponse> getAllVenues(Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return venueRepository.findByTenantId(tenantId, pageable).map(this::mapToVenueResponse);
    }

    @Override
    @Transactional
    public VenueResponse updateVenue(String id, VenueRequest request) {
        String tenantId = TenantContext.getTenantId();
        Venue venue = venueRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + id));

        venue.setName(request.getName());
        venue.setAddress(request.getAddress());
        venue.setCity(request.getCity());
        venue.setState(request.getState());
        venue.setCountry(request.getCountry());
        venue.setPostalCode(request.getPostalCode());
        venue.setCapacity(request.getCapacity());
        venue.setVirtual(request.isVirtual());
        venue.setVirtualUrl(request.getVirtualUrl());

        Venue saved = venueRepository.save(venue);
        return mapToVenueResponse(saved);
    }

    @Override
    @Transactional
    public void deleteVenue(String id) {
        String tenantId = TenantContext.getTenantId();
        Venue venue = venueRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + id));
        venueRepository.delete(venue);
    }

    @Override
    @Transactional
    public RoomResponse addRoom(String venueId, RoomRequest request) {
        String tenantId = TenantContext.getTenantId();
        Venue venue = venueRepository.findByIdAndTenantId(venueId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + venueId));

        Room room = Room.builder()
                .tenantId(tenantId)
                .venue(venue)
                .name(request.getName())
                .capacity(request.getCapacity())
                .floorLevel(request.getFloorLevel())
                .equipmentNotes(request.getEquipmentNotes())
                .build();

        Room saved = roomRepository.save(room);
        return mapToRoomResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getRoomsByVenue(String venueId) {
        String tenantId = TenantContext.getTenantId();
        return roomRepository.findByTenantIdAndVenueId(tenantId, venueId).stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteRoom(String venueId, String roomId) {
        String tenantId = TenantContext.getTenantId();
        Room room = roomRepository.findByIdAndTenantId(roomId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));
        roomRepository.delete(room);
    }

    private VenueResponse mapToVenueResponse(Venue venue) {
        List<RoomResponse> roomResponses = venue.getRooms() != null ?
                venue.getRooms().stream().map(this::mapToRoomResponse).collect(Collectors.toList()) :
                List.of();

        return VenueResponse.builder()
                .id(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .city(venue.getCity())
                .state(venue.getState())
                .country(venue.getCountry())
                .postalCode(venue.getPostalCode())
                .capacity(venue.getCapacity())
                .virtual(venue.isVirtual())
                .virtualUrl(venue.getVirtualUrl())
                .rooms(roomResponses)
                .createdAt(venue.getCreatedAt())
                .updatedAt(venue.getUpdatedAt())
                .build();
    }

    private RoomResponse mapToRoomResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .venueId(room.getVenue().getId())
                .name(room.getName())
                .capacity(room.getCapacity())
                .floorLevel(room.getFloorLevel())
                .equipmentNotes(room.getEquipmentNotes())
                .createdAt(room.getCreatedAt())
                .build();
    }
}
