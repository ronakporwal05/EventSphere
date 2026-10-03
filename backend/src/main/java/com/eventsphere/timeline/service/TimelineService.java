package com.eventsphere.timeline.service;

import com.eventsphere.timeline.dto.TimelineRequest;
import com.eventsphere.timeline.dto.TimelineResponse;

import java.util.List;

public interface TimelineService {

    TimelineResponse addMilestone(TimelineRequest request);

    List<TimelineResponse> getTimelinesByEvent(String eventId);

    void deleteMilestone(String id);
}
