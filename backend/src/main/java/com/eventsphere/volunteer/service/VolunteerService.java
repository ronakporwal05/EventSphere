package com.eventsphere.volunteer.service;

import com.eventsphere.volunteer.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VolunteerService {

    VolunteerResponse applyVolunteer(String userId, VolunteerApplyRequest request);

    VolunteerResponse updateVolunteerStatus(String volunteerId, String status, String role);

    VolunteerResponse toggleScannerMode(String volunteerId, boolean enabled);

    Page<VolunteerResponse> getVolunteersByEvent(String eventId, Pageable pageable);

    ShiftResponse assignShift(ShiftCreateRequest request);

    List<ShiftResponse> getVolunteerShifts(String volunteerId);

    TaskResponse assignTask(TaskCreateRequest request);

    TaskResponse updateTaskStatus(String taskId, String status);

    List<TaskResponse> getVolunteerTasks(String volunteerId);

    VolunteerPerformanceResponse getVolunteerPerformance(String volunteerId);
}
