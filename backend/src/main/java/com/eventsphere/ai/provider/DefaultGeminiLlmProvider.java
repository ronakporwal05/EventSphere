package com.eventsphere.ai.provider;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Real Gemini 1.5 Flash LLM provider.
 * Calls: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=API_KEY
 */
@Component
@Slf4j
public class DefaultGeminiLlmProvider implements LlmProvider {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${eventsphere.gemini.api-key:}")
    private String apiKey;

    @Value("${eventsphere.gemini.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String baseUrl;

    @Value("${eventsphere.gemini.llm-model:gemini-1.5-flash}")
    private String model;

    @Override
    public String getProviderName() {
        return "GEMINI_1_5_FLASH";
    }

    @Override
    public LlmResponse generateCompletion(String systemPrompt, String userPrompt) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("[LLM] GEMINI_API_KEY not configured — returning mock response.");
            return new LlmResponse("AI response unavailable: API key not configured.", 0, 0);
        }

        String url = baseUrl + "/models/" + model + ":generateContent?key=" + apiKey;

        // Build request body as a plain Map (no extra deps needed)
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(
                    Map.of("text", systemPrompt + "\n\nUser Question: " + userPrompt)
                ))
            ),
            "generationConfig", Map.of(
                "temperature", 0.3,
                "maxOutputTokens", 1024
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            log.info("[LLM - {}] Calling Gemini API (model={})...", getProviderName(), model);
            ResponseEntity<GeminiResponse> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, GeminiResponse.class
            );

            GeminiResponse body = response.getBody();
            if (body == null || body.candidates() == null || body.candidates().isEmpty()) {
                log.warn("[LLM] Gemini returned empty candidates.");
                return new LlmResponse("No response from AI model.", 0, 0);
            }

            String text = body.candidates().get(0).content().parts().get(0).text();
            int promptTokens  = body.usageMetadata() != null ? body.usageMetadata().promptTokenCount()     : (systemPrompt.length() + userPrompt.length()) / 4;
            int outputTokens  = body.usageMetadata() != null ? body.usageMetadata().candidatesTokenCount() : text.length() / 4;

            log.info("[LLM] Gemini response: {} input tokens, {} output tokens", promptTokens, outputTokens);
            return new LlmResponse(text, promptTokens, outputTokens);

        } catch (Exception ex) {
            log.error("[LLM] Gemini API call failed: {}", ex.getMessage());
            return new LlmResponse("AI temporarily unavailable. Please try again shortly.", 0, 0);
        }
    }

    // ── Response record classes (Jackson auto-maps these) ──────────────────────

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GeminiResponse(
        List<Candidate> candidates,
        UsageMetadata usageMetadata
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Candidate(Content content) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Content(List<Part> parts) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Part(String text) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record UsageMetadata(int promptTokenCount, int candidatesTokenCount) {}
}
