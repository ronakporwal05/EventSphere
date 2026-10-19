package com.eventsphere.ai.provider;

public interface LlmProvider {

    String getProviderName();

    LlmResponse generateCompletion(String systemPrompt, String userPrompt);

    record LlmResponse(String text, int promptTokens, int completionTokens) {}
}
