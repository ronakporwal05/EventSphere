package com.eventsphere.venue.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueRequest {

    @NotBlank(message = "Venue name is required")
    private String name;

    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    @Min(value = 0, message = "Capacity cannot be negative")
    private int capacity;

    private boolean virtual;
    private String virtualUrl;
}
