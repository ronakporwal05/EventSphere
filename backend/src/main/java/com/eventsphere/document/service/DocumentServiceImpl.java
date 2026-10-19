package com.eventsphere.document.service;

import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.document.dto.DocumentCreateRequest;
import com.eventsphere.document.dto.DocumentResponse;
import com.eventsphere.document.entity.EventDocument;
import com.eventsphere.document.repository.EventDocumentRepository;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentServiceImpl implements DocumentService {

    private final EventDocumentRepository documentRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional
    public DocumentResponse uploadDocument(DocumentCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Attaching document '{}' to event '{}'", request.getFileName(), request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        EventDocument doc = EventDocument.builder()
                .tenantId(tenantId)
                .event(event)
                .fileName(request.getFileName())
                .fileUrl(request.getFileUrl())
                .fileType(request.getFileType())
                .fileSizeBytes(request.getFileSizeBytes())
                .category(request.getCategory() != null ? request.getCategory() : "GENERAL")
                .build();

        EventDocument saved = documentRepository.save(doc);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse getDocumentById(String id) {
        String tenantId = TenantContext.getTenantId();
        EventDocument doc = documentRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
        return mapToResponse(doc);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return documentRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteDocument(String id) {
        String tenantId = TenantContext.getTenantId();
        EventDocument doc = documentRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        doc.setDeleted(true);
        documentRepository.save(doc);
        log.info("Soft-deleted document ID: {}", id);
    }

    private DocumentResponse mapToResponse(EventDocument doc) {
        return DocumentResponse.builder()
                .id(doc.getId())
                .eventId(doc.getEvent().getId())
                .fileName(doc.getFileName())
                .fileUrl(doc.getFileUrl())
                .fileType(doc.getFileType())
                .fileSizeBytes(doc.getFileSizeBytes())
                .category(doc.getCategory())
                .createdAt(doc.getCreatedAt())
                .build();
    }
}
