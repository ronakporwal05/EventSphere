package com.eventsphere.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalResponse {
    private String id;
    private String eventId;
    private String title;
    private String fileName;
    private String summary;
    private String status;
    private String reviewedBy;
    private Instant reviewedAt;
    private Instant createdAt;
    private List<MilestoneDto> milestones;
}
