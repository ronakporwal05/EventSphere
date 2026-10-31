package com.eventsphere.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneDto {
    private String id;
    private String title;
    private String description;
    private String deliverables;
    private String dependencies;
    private Instant targetDate;
    private double weight;
    private boolean approved;
    private String matchedTaskId;
    private String matchedTaskTitle;
    private double similarityScore;
}
