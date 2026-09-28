package com.eventsphere.registration.dto;

import com.eventsphere.registration.entity.RegistrationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private RegistrationStatus status;

    private String reason;
}
