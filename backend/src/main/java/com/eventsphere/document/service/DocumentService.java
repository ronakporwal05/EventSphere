package com.eventsphere.document.service;

import com.eventsphere.document.dto.DocumentCreateRequest;
import com.eventsphere.document.dto.DocumentResponse;

import java.util.List;

public interface DocumentService {

    DocumentResponse uploadDocument(DocumentCreateRequest request);

    DocumentResponse getDocumentById(String id);

    List<DocumentResponse> getDocumentsByEvent(String eventId);

    void deleteDocument(String id);
}
