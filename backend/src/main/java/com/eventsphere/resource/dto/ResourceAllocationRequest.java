package com.eventsphere.resource.dto;

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
public class ResourceAllocationRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    @Min(value = 1, message = "Quantity allocated must be at least 1")
    private int quantityAllocated;
}
