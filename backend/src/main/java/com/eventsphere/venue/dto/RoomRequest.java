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
public class RoomRequest {

    @NotBlank(message = "Room name is required")
    private String name;

    @Min(value = 0, message = "Capacity cannot be negative")
    private int capacity;

    private String floorLevel;
    private String equipmentNotes;
}
