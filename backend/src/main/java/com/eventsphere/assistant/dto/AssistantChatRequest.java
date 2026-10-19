package com.eventsphere.assistant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssistantChatRequest {

    private String conversationId;
    private String eventId;

    @NotBlank(message = "Message content is required")
    private String message;
}
