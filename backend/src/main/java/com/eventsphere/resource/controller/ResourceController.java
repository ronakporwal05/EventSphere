package com.eventsphere.resource.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.resource.dto.ResourceAllocationRequest;
import com.eventsphere.resource.dto.ResourceRequest;
import com.eventsphere.resource.dto.ResourceResponse;
import com.eventsphere.resource.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_RESOURCE", entityType = "RESOURCE")
    public ResponseEntity<ApiResponse<ResourceResponse>> createResource(@Valid @RequestBody ResourceRequest request) {
        ResourceResponse response = resourceService.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resource created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> getResourceById(@PathVariable("id") String id) {
        ResourceResponse response = resourceService.getResourceById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ResourceResponse>> getResources(Pageable pageable) {
        Page<ResourceResponse> page = resourceService.getResources(pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Resources retrieved successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPDATE_RESOURCE", entityType = "RESOURCE")
    public ResponseEntity<ApiResponse<ResourceResponse>> updateResource(@PathVariable("id") String id, @Valid @RequestBody ResourceRequest request) {
        ResourceResponse response = resourceService.updateResource(id, request);
        return ResponseEntity.ok(ApiResponse.success("Resource updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "DELETE_RESOURCE", entityType = "RESOURCE")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable("id") String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully", null));
    }

    @PostMapping("/allocate")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "ALLOCATE_RESOURCE", entityType = "EVENT_RESOURCE")
    public ResponseEntity<ApiResponse<Void>> allocateResource(@Valid @RequestBody ResourceAllocationRequest request) {
        resourceService.allocateResourceToEvent(request);
        return ResponseEntity.ok(ApiResponse.success("Resource allocated to event successfully", null));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getResourcesByEvent(@PathVariable("eventId") String eventId) {
        List<ResourceResponse> list = resourceService.getResourcesByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
