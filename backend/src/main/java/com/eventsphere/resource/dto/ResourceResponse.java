package com.eventsphere.resource.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {
    private String id;
    private String name;
    private String resourceType;
    private int quantityAvailable;
    private BigDecimal unitCost;
    private String notes;
    private Instant createdAt;
}
