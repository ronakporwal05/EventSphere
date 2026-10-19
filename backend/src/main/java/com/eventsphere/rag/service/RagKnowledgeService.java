package com.eventsphere.rag.service;

import com.eventsphere.rag.dto.RagQueryRequest;
import com.eventsphere.rag.dto.RagQueryResponse;

public interface RagKnowledgeService {

    RagQueryResponse queryKnowledgeBase(RagQueryRequest request);
}
