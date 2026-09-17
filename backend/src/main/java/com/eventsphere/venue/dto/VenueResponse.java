package com.eventsphere.venue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueResponse {
    private String id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private int capacity;
    private boolean virtual;
    private String virtualUrl;
    private List<RoomResponse> rooms;
    private Instant createdAt;
    private Instant updatedAt;
}
