package com.eventsphere.ai.provider;

import java.util.List;

public interface EmbeddingProvider {

    String getProviderName();

    float[] generateEmbedding(String text);

    List<float[]> generateBatchEmbeddings(List<String> textChunks);
}
