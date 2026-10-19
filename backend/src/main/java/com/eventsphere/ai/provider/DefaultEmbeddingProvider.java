package com.eventsphere.ai.provider;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Real Google text-embedding-004 provider.
 * Calls: POST https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=API_KEY
 * Output dimension: 768 floats.
 */
@Component
@Slf4j
public class DefaultEmbeddingProvider implements EmbeddingProvider {

    private static final int EMBEDDING_DIMENSION = 768;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${eventsphere.gemini.api-key:}")
    private String apiKey;

    @Value("${eventsphere.gemini.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String baseUrl;

    @Value("${eventsphere.gemini.embedding-model:text-embedding-004}")
    private String embeddingModel;

    @Override
    public String getProviderName() {
        return "GEMINI_TEXT_EMBEDDING_004";
    }

    @Override
    public float[] generateEmbedding(String text) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("[EMBED] GEMINI_API_KEY not set — using hash-based mock vector.");
            return mockVector(text);
        }

        String url = baseUrl + "/models/" + embeddingModel + ":embedContent?key=" + apiKey;

        Map<String, Object> requestBody = Map.of(
            "model", "models/" + embeddingModel,
            "content", Map.of(
                "parts", List.of(Map.of("text", text))
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            log.debug("[EMBED] Calling text-embedding-004 for text length {}...", text.length());
            ResponseEntity<EmbeddingResponse> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, EmbeddingResponse.class
            );

            EmbeddingResponse body = response.getBody();
            if (body == null || body.embedding() == null || body.embedding().values() == null) {
                log.warn("[EMBED] Empty embedding response — using mock vector.");
                return mockVector(text);
            }

            List<Double> values = body.embedding().values();
            float[] vector = new float[values.size()];
            for (int i = 0; i < values.size(); i++) {
                vector[i] = values.get(i).floatValue();
            }
            log.debug("[EMBED] Got real embedding of dim={}", vector.length);
            return vector;

        } catch (Exception ex) {
            log.error("[EMBED] Embedding API call failed: {} — using mock vector.", ex.getMessage());
            return mockVector(text);
        }
    }

    @Override
    public List<float[]> generateBatchEmbeddings(List<String> textChunks) {
        List<float[]> embeddings = new ArrayList<>();
        for (String chunk : textChunks) {
            embeddings.add(generateEmbedding(chunk));
        }
        return embeddings;
    }

    /** Deterministic fallback — same text always gives same vector. */
    private float[] mockVector(String text) {
        float[] vector = new float[EMBEDDING_DIMENSION];
        int hash = text.hashCode();
        for (int i = 0; i < EMBEDDING_DIMENSION; i++) {
            vector[i] = (float) Math.sin(hash + i);
        }
        return vector;
    }

    // ── Response records ───────────────────────────────────────────────────────

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record EmbeddingResponse(EmbeddingValues embedding) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record EmbeddingValues(List<Double> values) {}
}
