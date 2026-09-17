package com.eventsphere.event.service;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.dto.*;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.entity.EventCustomField;
import com.eventsphere.event.entity.EventState;
import com.eventsphere.event.repository.EventCustomFieldRepository;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.venue.entity.Venue;
import com.eventsphere.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventCustomFieldRepository customFieldRepository;
    private final VenueRepository venueRepository;

    @Override
    @Transactional
    public EventResponse createEvent(EventCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating event '{}' for tenant '{}'", request.getTitle(), tenantId);

        if (eventRepository.existsBySlugAndTenantId(request.getSlug(), tenantId)) {
            throw new ResourceConflictException("Event with slug '" + request.getSlug() + "' already exists in this tenant");
        }

        Venue venue = null;
        if (request.getVenueId() != null) {
            venue = venueRepository.findByIdAndTenantId(request.getVenueId(), tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + request.getVenueId()));
        }

        Event event = Event.builder()
                .tenantId(tenantId)
                .title(request.getTitle())
                .slug(request.getSlug().toLowerCase().trim())
                .shortDescription(request.getShortDescription())
                .description(request.getDescription())
                .bannerUrl(request.getBannerUrl())
                .logoUrl(request.getLogoUrl())
                .category(request.getCategory())
                .eventType(request.getEventType() != null ? request.getEventType() : "HYBRID")
                .status(EventState.DRAFT)
                .capacity(request.getCapacity())
                .registrationStart(request.getRegistrationStart())
                .registrationEnd(request.getRegistrationEnd())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .venue(venue)
                .isPublic(request.isPublic())
                .requireApproval(request.isRequireApproval())
                .build();

        if (request.getCustomFields() != null) {
            List<EventCustomField> customFields = request.getCustomFields().stream()
                    .map(cf -> EventCustomField.builder()
                            .tenantId(tenantId)
                            .event(event)
                            .fieldName(cf.getFieldName())
                            .fieldLabel(cf.getFieldLabel())
                            .fieldType(cf.getFieldType() != null ? cf.getFieldType() : "TEXT")
                            .required(cf.isRequired())
                            .optionsJson(cf.getOptionsJson())
                            .displayOrder(cf.getDisplayOrder())
                            .build())
                    .collect(Collectors.toList());
            event.setCustomFields(customFields);
        }

        Event saved = eventRepository.save(event);
        return mapToEventResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponse getEventById(String id) {
        String tenantId = TenantContext.getTenantId();
        Event event = eventRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return mapToEventResponse(event);
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponse getEventBySlug(String slug) {
        String tenantId = TenantContext.getTenantId();
        Event event = eventRepository.findBySlugAndTenantId(slug, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with slug: " + slug));
        return mapToEventResponse(event);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventResponse> getAllEvents(EventState status, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        if (status != null) {
            return eventRepository.findByTenantIdAndStatus(tenantId, status, pageable).map(this::mapToEventResponse);
        }
        return eventRepository.findByTenantId(tenantId, pageable).map(this::mapToEventResponse);
    }

    @Override
    @Transactional
    public EventResponse updateEvent(String id, EventUpdateRequest request) {
        String tenantId = TenantContext.getTenantId();
        Event event = eventRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getShortDescription() != null) event.setShortDescription(request.getShortDescription());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getBannerUrl() != null) event.setBannerUrl(request.getBannerUrl());
        if (request.getLogoUrl() != null) event.setLogoUrl(request.getLogoUrl());
        if (request.getCategory() != null) event.setCategory(request.getCategory());
        if (request.getEventType() != null) event.setEventType(request.getEventType());
        if (request.getCapacity() != null) event.setCapacity(request.getCapacity());
        if (request.getRegistrationStart() != null) event.setRegistrationStart(request.getRegistrationStart());
        if (request.getRegistrationEnd() != null) event.setRegistrationEnd(request.getRegistrationEnd());
        if (request.getStartDate() != null) event.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) event.setEndDate(request.getEndDate());
        if (request.getIsPublic() != null) event.setPublic(request.getIsPublic());
        if (request.getRequireApproval() != null) event.setRequireApproval(request.getRequireApproval());

        if (request.getVenueId() != null) {
            Venue venue = venueRepository.findByIdAndTenantId(request.getVenueId(), tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + request.getVenueId()));
            event.setVenue(venue);
        }

        Event saved = eventRepository.save(event);
        return mapToEventResponse(saved);
    }

    @Override
    @Transactional
    public EventResponse transitionEventState(String id, EventStatusUpdateRequest request) {
        String tenantId = TenantContext.getTenantId();
        Event event = eventRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        EventState currentState = event.getStatus();
        EventState targetState = request.getTargetState();

        validateStateTransition(currentState, targetState);

        log.info("Transitioning event '{}' state from {} to {}", id, currentState, targetState);
        event.setStatus(targetState);
        Event saved = eventRepository.save(event);
        return mapToEventResponse(saved);
    }

    @Override
    @Transactional
    public EventResponse cloneEvent(String id, String newTitle, String newSlug) {
        String tenantId = TenantContext.getTenantId();
        Event sourceEvent = eventRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (eventRepository.existsBySlugAndTenantId(newSlug, tenantId)) {
            throw new ResourceConflictException("Event with slug '" + newSlug + "' already exists");
        }

        Event cloned = Event.builder()
                .tenantId(tenantId)
                .title(newTitle)
                .slug(newSlug.toLowerCase().trim())
                .shortDescription(sourceEvent.getShortDescription())
                .description(sourceEvent.getDescription())
                .bannerUrl(sourceEvent.getBannerUrl())
                .logoUrl(sourceEvent.getLogoUrl())
                .category(sourceEvent.getCategory())
                .eventType(sourceEvent.getEventType())
                .status(EventState.DRAFT)
                .capacity(sourceEvent.getCapacity())
                .startDate(sourceEvent.getStartDate())
                .endDate(sourceEvent.getEndDate())
                .venue(sourceEvent.getVenue())
                .isPublic(sourceEvent.isPublic())
                .requireApproval(sourceEvent.isRequireApproval())
                .build();

        Event savedCloned = eventRepository.save(cloned);
        return mapToEventResponse(savedCloned);
    }

    @Override
    @Transactional
    public void deleteEvent(String id) {
        String tenantId = TenantContext.getTenantId();
        Event event = eventRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        eventRepository.delete(event);
    }

    private void validateStateTransition(EventState current, EventState target) {
        if (target == EventState.CANCELLED) {
            return; // Any event state can be cancelled
        }

        boolean valid = switch (current) {
            case DRAFT -> target == EventState.REVIEW || target == EventState.PUBLISHED;
            case REVIEW -> target == EventState.APPROVED || target == EventState.DRAFT;
            case APPROVED -> target == EventState.PUBLISHED;
            case PUBLISHED -> target == EventState.REGISTRATION_OPEN || target == EventState.LIVE;
            case REGISTRATION_OPEN -> target == EventState.LIVE || target == EventState.COMPLETED;
            case LIVE -> target == EventState.COMPLETED;
            case COMPLETED -> target == EventState.CERTIFICATE_GENERATED || target == EventState.ARCHIVED;
            case CERTIFICATE_GENERATED -> target == EventState.ARCHIVED;
            case ARCHIVED, CANCELLED -> false;
        };

        if (!valid) {
            throw new ResourceConflictException("Invalid event state transition from " + current + " to " + target);
        }
    }

    private EventResponse mapToEventResponse(Event event) {
        List<EventCustomFieldDTO> fieldDTOs = event.getCustomFields() != null ?
                event.getCustomFields().stream().map(cf -> EventCustomFieldDTO.builder()
                        .id(cf.getId())
                        .fieldName(cf.getFieldName())
                        .fieldLabel(cf.getFieldLabel())
                        .fieldType(cf.getFieldType())
                        .required(cf.isRequired())
                        .optionsJson(cf.getOptionsJson())
                        .displayOrder(cf.getDisplayOrder())
                        .build()).collect(Collectors.toList()) : List.of();

        return EventResponse.builder()
                .id(event.getId())
                .tenantId(event.getTenantId())
                .title(event.getTitle())
                .slug(event.getSlug())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .bannerUrl(event.getBannerUrl())
                .logoUrl(event.getLogoUrl())
                .category(event.getCategory())
                .eventType(event.getEventType())
                .status(event.getStatus())
                .capacity(event.getCapacity())
                .registrationStart(event.getRegistrationStart())
                .registrationEnd(event.getRegistrationEnd())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .isPublic(event.isPublic())
                .requireApproval(event.isRequireApproval())
                .customFields(fieldDTOs)
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
