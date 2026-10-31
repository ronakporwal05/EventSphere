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
public class MilestoneApprovalRequest {
    private List<String> approvedMilestoneIds;
    private String proposalStatus; // APPROVED, REJECTED
}
