package com.eventsphere.volunteer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskCreateRequest {

    @NotBlank(message = "Volunteer ID is required")
    private String volunteerId;

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private String priority; // LOW, MEDIUM, HIGH, URGENT
}
