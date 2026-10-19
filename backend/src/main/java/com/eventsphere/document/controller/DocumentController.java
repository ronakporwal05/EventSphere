package com.eventsphere.document.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.document.dto.DocumentCreateRequest;
import com.eventsphere.document.dto.DocumentResponse;
import com.eventsphere.document.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPLOAD_DOCUMENT", entityType = "DOCUMENT")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(@Valid @RequestBody DocumentCreateRequest request) {
        DocumentResponse response = documentService.uploadDocument(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document attached successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentResponse>> getDocumentById(@PathVariable("id") String id) {
        DocumentResponse response = documentService.getDocumentById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getDocumentsByEvent(@PathVariable("eventId") String eventId) {
        List<DocumentResponse> list = documentService.getDocumentsByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "DELETE_DOCUMENT", entityType = "DOCUMENT")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable("id") String id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok(ApiResponse.success("Document deleted successfully", null));
    }
}
