package com.eventsphere.ai.provider;

import java.util.List;
import java.util.Map;

public interface VectorStoreProvider {

    String getStoreName();

    String storeVector(String collectionName, String id, float[] vector, Map<String, Object> metadata);

    List<VectorSearchResult> searchVectors(String collectionName, float[] queryVector, int topK, Map<String, Object> filterMetadata);

    record VectorSearchResult(String id, double score, Map<String, Object> metadata) {}
}
