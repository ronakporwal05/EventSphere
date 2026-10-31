package com.eventsphere.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventProgressResponse {
    private String eventId;
    private String eventTitle;
    private double actualProgress;
    private double plannedProgress;
    private double progressGap;
    private int totalTasks;
    private int completedTasks;
    private int inProgressTasks;
    private int overdueTasks;
    private int blockedTasks;
    private int approvedMilestonesCount;
    private int missingMilestonesCount;
    private String formulaDescription;
    private List<String> overdueTaskTitles;
    private List<String> blockedTaskTitles;
    private List<String> missingMilestoneTitles;
}
