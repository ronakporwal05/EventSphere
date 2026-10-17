package com.eventsphere.resource.service;

import com.eventsphere.resource.dto.ResourceAllocationRequest;
import com.eventsphere.resource.dto.ResourceRequest;
import com.eventsphere.resource.dto.ResourceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResourceService {

    ResourceResponse createResource(ResourceRequest request);

    ResourceResponse getResourceById(String id);

    Page<ResourceResponse> getResources(Pageable pageable);

    ResourceResponse updateResource(String id, ResourceRequest request);

    void deleteResource(String id);

    void allocateResourceToEvent(ResourceAllocationRequest request);

    List<ResourceResponse> getResourcesByEvent(String eventId);
}
