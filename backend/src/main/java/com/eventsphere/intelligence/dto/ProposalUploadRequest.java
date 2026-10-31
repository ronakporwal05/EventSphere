package com.eventsphere.intelligence.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalUploadRequest {

    @NotBlank(message = "Event ID is required")
    private String eventId;

    @NotBlank(message = "Proposal title is required")
    private String title;

    private String fileName;

    @NotBlank(message = "Proposal content is required")
    private String content;
}
