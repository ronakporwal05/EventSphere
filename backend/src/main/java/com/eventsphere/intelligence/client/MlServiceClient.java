package com.eventsphere.intelligence.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;

@Component
@Slf4j
public class MlServiceClient {

    private final RestTemplate restTemplate;

    @Value("${eventsphere.ml-service.url:http://localhost:8000}")
    private String mlServiceUrl;

    public MlServiceClient(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(4))
                .setReadTimeout(Duration.ofSeconds(6))
                .build();
    }

    public <T> T post(String endpoint, Object requestBody, Class<T> responseType) {
        String url = mlServiceUrl + endpoint;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Object> entity = new HttpEntity<>(requestBody, headers);

            log.info("[ML-CLIENT] Dispatching inference request to: {}", url);
            ResponseEntity<T> response = restTemplate.postForEntity(url, entity, responseType);
            return response.getBody();
        } catch (Exception e) {
            log.warn("[ML-CLIENT] Failed to call ML Service at {}: {}. Will utilize resilient fallback.", url, e.getMessage());
            return null;
        }
    }

    public boolean isHealthy() {
        try {
            ResponseEntity<Map> res = restTemplate.getForEntity(mlServiceUrl + "/health", Map.class);
            return res.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }
}
