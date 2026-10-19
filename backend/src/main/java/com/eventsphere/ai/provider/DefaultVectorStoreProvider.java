package com.eventsphere.ai.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class DefaultVectorStoreProvider implements VectorStoreProvider {

    private final Map<String, VectorEntry> vectorStore = new ConcurrentHashMap<>();

    private record VectorEntry(String id, float[] vector, Map<String, Object> metadata) {}

    @Override
    public String getStoreName() {
        return "QDRANT_VECTOR_DB";
    }

    @Override
    public String storeVector(String collectionName, String id, float[] vector, Map<String, Object> metadata) {
        String key = collectionName + ":" + id;
        vectorStore.put(key, new VectorEntry(id, vector, metadata));
        log.debug("Stored vector key '{}' in collection '{}'", key, collectionName);
        return id;
    }

    @Override
    public List<VectorSearchResult> searchVectors(String collectionName, float[] queryVector, int topK, Map<String, Object> filterMetadata) {
        List<VectorSearchResult> results = new ArrayList<>();

        for (Map.Entry<String, VectorEntry> entry : vectorStore.entrySet()) {
            if (!entry.getKey().startsWith(collectionName + ":")) {
                continue;
            }

            VectorEntry ve = entry.getValue();

            // Multi-tenant Filter Matching
            boolean matchesFilter = true;
            if (filterMetadata != null) {
                for (Map.Entry<String, Object> f : filterMetadata.entrySet()) {
                    Object actual = ve.metadata().get(f.getKey());
                    if (actual == null || !actual.equals(f.getValue())) {
                        matchesFilter = false;
                        break;
                    }
                }
            }

            if (matchesFilter) {
                double cosineSim = computeCosineSimilarity(queryVector, ve.vector());
                results.add(new VectorSearchResult(ve.id(), cosineSim, ve.metadata()));
            }
        }

        results.sort((a, b) -> Double.compare(b.score(), a.score()));
        return results.subList(0, Math.min(topK, results.size()));
    }

    private double computeCosineSimilarity(float[] vectorA, float[] vectorB) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-9);
    }
}
