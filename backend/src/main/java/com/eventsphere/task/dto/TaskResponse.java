package com.eventsphere.task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private String id;
    private String eventId;
    private String title;
    private String description;
    private String assigneeUserId;
    private String priority;
    private String status;
    private Instant dueDate;
    private Instant createdAt;
}
