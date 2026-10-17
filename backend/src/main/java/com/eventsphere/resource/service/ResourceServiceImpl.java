package com.eventsphere.resource.service;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.resource.dto.ResourceAllocationRequest;
import com.eventsphere.resource.dto.ResourceRequest;
import com.eventsphere.resource.dto.ResourceResponse;
import com.eventsphere.resource.entity.EventResource;
import com.eventsphere.resource.entity.Resource;
import com.eventsphere.resource.repository.EventResourceRepository;
import com.eventsphere.resource.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final EventResourceRepository eventResourceRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional
    public ResourceResponse createResource(ResourceRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating resource '{}' for tenant '{}'", request.getName(), tenantId);

        Resource resource = Resource.builder()
                .tenantId(tenantId)
                .name(request.getName())
                .resourceType(request.getResourceType())
                .quantityAvailable(request.getQuantityAvailable())
                .unitCost(request.getUnitCost())
                .notes(request.getNotes())
                .build();

        Resource saved = resourceRepository.save(resource);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceResponse getResourceById(String id) {
        String tenantId = TenantContext.getTenantId();
        Resource resource = resourceRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        return mapToResponse(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResourceResponse> getResources(Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return resourceRepository.findByTenantIdAndDeletedFalse(tenantId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public ResourceResponse updateResource(String id, ResourceRequest request) {
        String tenantId = TenantContext.getTenantId();
        Resource resource = resourceRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

        resource.setName(request.getName());
        resource.setResourceType(request.getResourceType());
        resource.setQuantityAvailable(request.getQuantityAvailable());
        resource.setUnitCost(request.getUnitCost());
        resource.setNotes(request.getNotes());

        Resource saved = resourceRepository.save(resource);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteResource(String id) {
        String tenantId = TenantContext.getTenantId();
        Resource resource = resourceRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

        resource.setDeleted(true);
        resourceRepository.save(resource);
        log.info("Soft-deleted resource ID: {}", id);
    }

    @Override
    @Transactional
    public void allocateResourceToEvent(ResourceAllocationRequest request) {
        String tenantId = TenantContext.getTenantId();
        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        Resource resource = resourceRepository.findByIdAndTenantIdAndDeletedFalse(request.getResourceId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + request.getResourceId()));

        if (resource.getQuantityAvailable() < request.getQuantityAllocated()) {
            throw new ResourceConflictException("Insufficient resource quantity available");
        }

        EventResource allocation = EventResource.builder()
                .tenantId(tenantId)
                .event(event)
                .resource(resource)
                .quantityAllocated(request.getQuantityAllocated())
                .status("APPROVED")
                .build();

        eventResourceRepository.save(allocation);
        log.info("Allocated {} units of '{}' to event '{}'", request.getQuantityAllocated(), resource.getName(), event.getTitle());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> getResourcesByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return eventResourceRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId).stream()
                .map(er -> mapToResponse(er.getResource()))
                .collect(Collectors.toList());
    }

    private ResourceResponse mapToResponse(Resource res) {
        return ResourceResponse.builder()
                .id(res.getId())
                .name(res.getName())
                .resourceType(res.getResourceType())
                .quantityAvailable(res.getQuantityAvailable())
                .unitCost(res.getUnitCost())
                .notes(res.getNotes())
                .createdAt(res.getCreatedAt())
                .build();
    }
}
