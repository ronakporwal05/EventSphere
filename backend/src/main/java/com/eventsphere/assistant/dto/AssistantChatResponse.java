package com.eventsphere.assistant.dto;

import com.eventsphere.rag.dto.Citation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssistantChatResponse {
    private String conversationId;
    private String messageId;
    private String answer;
    private String intentDetected;
    private List<Citation> citations;
}
