package com.eventsphere.timeline.service;

import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.timeline.dto.TimelineRequest;
import com.eventsphere.timeline.dto.TimelineResponse;
import com.eventsphere.timeline.entity.EventTimeline;
import com.eventsphere.timeline.repository.EventTimelineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TimelineServiceImpl implements TimelineService {

    private final EventTimelineRepository timelineRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional
    public TimelineResponse addMilestone(TimelineRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Adding milestone '{}' to event '{}'", request.getTitle(), request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        EventTimeline timeline = EventTimeline.builder()
                .tenantId(tenantId)
                .event(event)
                .title(request.getTitle())
                .description(request.getDescription())
                .milestoneDate(request.getMilestoneDate())
                .status(request.getStatus() != null ? request.getStatus() : "PLANNED")
                .displayOrder(request.getDisplayOrder())
                .build();

        EventTimeline saved = timelineRepository.save(timeline);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimelineResponse> getTimelinesByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return timelineRepository.findByTenantIdAndEventIdAndDeletedFalseOrderByDisplayOrderAscMilestoneDateAsc(tenantId, eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteMilestone(String id) {
        String tenantId = TenantContext.getTenantId();
        EventTimeline timeline = timelineRepository.findById(id)
                .filter(t -> t.getTenantId().equals(tenantId) && !t.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found with ID: " + id));

        timeline.setDeleted(true);
        timelineRepository.save(timeline);
        log.info("Soft-deleted milestone ID: {}", id);
    }

    private TimelineResponse mapToResponse(EventTimeline tl) {
        return TimelineResponse.builder()
                .id(tl.getId())
                .eventId(tl.getEvent().getId())
                .title(tl.getTitle())
                .description(tl.getDescription())
                .milestoneDate(tl.getMilestoneDate())
                .status(tl.getStatus())
                .displayOrder(tl.getDisplayOrder())
                .createdAt(tl.getCreatedAt())
                .build();
    }
}
