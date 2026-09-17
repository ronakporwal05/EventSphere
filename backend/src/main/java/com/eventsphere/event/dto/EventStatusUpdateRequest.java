package com.eventsphere.event.dto;

import com.eventsphere.event.entity.EventState;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventStatusUpdateRequest {

    @NotNull(message = "New event state is required")
    private EventState targetState;

    private String transitionReason;
}
