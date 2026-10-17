package com.eventsphere.volunteer.service;

import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.volunteer.dto.*;
import com.eventsphere.volunteer.entity.Volunteer;
import com.eventsphere.volunteer.entity.VolunteerPerformance;
import com.eventsphere.volunteer.entity.VolunteerShift;
import com.eventsphere.volunteer.entity.VolunteerTask;
import com.eventsphere.volunteer.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VolunteerServiceImpl implements VolunteerService {

    private final VolunteerRepository volunteerRepository;
    private final VolunteerShiftRepository shiftRepository;
    private final VolunteerTaskRepository taskRepository;
    private final VolunteerPerformanceRepository performanceRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public VolunteerResponse applyVolunteer(String userId, VolunteerApplyRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("User '{}' applying as volunteer for event '{}'", userId, request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (volunteerRepository.existsByTenantIdAndEventIdAndUserIdAndDeletedFalse(tenantId, event.getId(), userId)) {
            throw new ResourceConflictException("User has already applied to be a volunteer for this event.");
        }

        Volunteer volunteer = Volunteer.builder()
                .tenantId(tenantId)
                .event(event)
                .user(user)
                .assignedRole(request.getPreferredRole() != null ? request.getPreferredRole() : "SCANNER")
                .status("PENDING")
                .scannerModeEnabled(true)
                .build();

        Volunteer saved = volunteerRepository.save(volunteer);

        // Initialize Performance Record
        VolunteerPerformance performance = VolunteerPerformance.builder()
                .tenantId(tenantId)
                .volunteer(saved)
                .totalScansPerformed(0)
                .tasksCompleted(0)
                .rating(BigDecimal.valueOf(5.00))
                .build();
        performanceRepository.save(performance);

        return mapToVolunteerResponse(saved);
    }

    @Override
    @Transactional
    public VolunteerResponse updateVolunteerStatus(String volunteerId, String status, String role) {
        String tenantId = TenantContext.getTenantId();
        Volunteer v = volunteerRepository.findByIdAndTenantIdAndDeletedFalse(volunteerId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer record not found with ID: " + volunteerId));

        v.setStatus(status.toUpperCase());
        if (role != null && !role.isBlank()) {
            v.setAssignedRole(role.toUpperCase());
        }

        Volunteer saved = volunteerRepository.save(v);
        return mapToVolunteerResponse(saved);
    }

    @Override
    @Transactional
    public VolunteerResponse toggleScannerMode(String volunteerId, boolean enabled) {
        String tenantId = TenantContext.getTenantId();
        Volunteer v = volunteerRepository.findByIdAndTenantIdAndDeletedFalse(volunteerId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer record not found with ID: " + volunteerId));

        v.setScannerModeEnabled(enabled);
        Volunteer saved = volunteerRepository.save(v);
        return mapToVolunteerResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VolunteerResponse> getVolunteersByEvent(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return volunteerRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable).map(this::mapToVolunteerResponse);
    }

    @Override
    @Transactional
    public ShiftResponse assignShift(ShiftCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        Volunteer v = volunteerRepository.findByIdAndTenantIdAndDeletedFalse(request.getVolunteerId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer record not found with ID: " + request.getVolunteerId()));

        if (!"APPROVED".equalsIgnoreCase(v.getStatus())) {
            throw new ResourceConflictException("Cannot assign shift to a volunteer whose status is not APPROVED.");
        }

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new ResourceConflictException("Shift end time cannot be before start time.");
        }

        // Shift Conflict Detection Rule
        long overlapping = shiftRepository.countOverlappingShifts(tenantId, v.getId(), request.getStartTime(), request.getEndTime());
        if (overlapping > 0) {
            throw new ResourceConflictException("SHIFT CONFLICT DETECTED: Volunteer already has an overlapping shift during this timeframe.");
        }

        VolunteerShift shift = VolunteerShift.builder()
                .tenantId(tenantId)
                .event(v.getEvent())
                .volunteer(v)
                .shiftName(request.getShiftName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .location(request.getLocation())
                .status("ASSIGNED")
                .build();

        VolunteerShift saved = shiftRepository.save(shift);
        return mapToShiftResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShiftResponse> getVolunteerShifts(String volunteerId) {
        String tenantId = TenantContext.getTenantId();
        return shiftRepository.findByTenantIdAndVolunteerId(tenantId, volunteerId).stream()
                .map(this::mapToShiftResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse assignTask(TaskCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        Volunteer v = volunteerRepository.findByIdAndTenantIdAndDeletedFalse(request.getVolunteerId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer record not found with ID: " + request.getVolunteerId()));

        VolunteerTask task = VolunteerTask.builder()
                .tenantId(tenantId)
                .event(v.getEvent())
                .volunteer(v)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority().toUpperCase() : "MEDIUM")
                .status("PENDING")
                .build();

        VolunteerTask saved = taskRepository.save(task);
        return mapToTaskResponse(saved);
    }

    @Override
    @Transactional
    public TaskResponse updateTaskStatus(String taskId, String status) {
        String tenantId = TenantContext.getTenantId();
        VolunteerTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        String oldStatus = task.getStatus();
        String newStatus = status.toUpperCase();
        task.setStatus(newStatus);
        VolunteerTask saved = taskRepository.save(task);

        // Update Performance Metrics if Task Completed
        if ("COMPLETED".equals(newStatus) && !"COMPLETED".equals(oldStatus)) {
            VolunteerPerformance perf = performanceRepository.findByTenantIdAndVolunteerId(tenantId, task.getVolunteer().getId())
                    .orElseGet(() -> VolunteerPerformance.builder().tenantId(tenantId).volunteer(task.getVolunteer()).build());

            perf.setTasksCompleted(perf.getTasksCompleted() + 1);
            performanceRepository.save(perf);
        }

        return mapToTaskResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getVolunteerTasks(String volunteerId) {
        String tenantId = TenantContext.getTenantId();
        return taskRepository.findByTenantIdAndVolunteerId(tenantId, volunteerId).stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VolunteerPerformanceResponse getVolunteerPerformance(String volunteerId) {
        String tenantId = TenantContext.getTenantId();
        Volunteer v = volunteerRepository.findByIdAndTenantIdAndDeletedFalse(volunteerId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found"));

        VolunteerPerformance perf = performanceRepository.findByTenantIdAndVolunteerId(tenantId, volunteerId)
                .orElseGet(() -> VolunteerPerformance.builder()
                        .tenantId(tenantId)
                        .volunteer(v)
                        .totalScansPerformed(0)
                        .tasksCompleted(0)
                        .rating(BigDecimal.valueOf(5.00))
                        .build());

        return VolunteerPerformanceResponse.builder()
                .id(perf.getId())
                .volunteerId(v.getId())
                .volunteerName(v.getUser().getFirstName() + " " + v.getUser().getLastName())
                .totalScansPerformed(perf.getTotalScansPerformed())
                .tasksCompleted(perf.getTasksCompleted())
                .rating(perf.getRating())
                .notes(perf.getNotes())
                .build();
    }

    private VolunteerResponse mapToVolunteerResponse(Volunteer v) {
        return VolunteerResponse.builder()
                .id(v.getId())
                .eventId(v.getEvent().getId())
                .userId(v.getUser().getId())
                .userName(v.getUser().getFirstName() + " " + v.getUser().getLastName())
                .userEmail(v.getUser().getEmail())
                .assignedRole(v.getAssignedRole())
                .status(v.getStatus())
                .scannerModeEnabled(v.isScannerModeEnabled())
                .createdAt(v.getCreatedAt())
                .build();
    }

    private ShiftResponse mapToShiftResponse(VolunteerShift s) {
        return ShiftResponse.builder()
                .id(s.getId())
                .volunteerId(s.getVolunteer().getId())
                .shiftName(s.getShiftName())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .location(s.getLocation())
                .status(s.getStatus())
                .createdAt(s.getCreatedAt())
                .build();
    }

    private TaskResponse mapToTaskResponse(VolunteerTask t) {
        return TaskResponse.builder()
                .id(t.getId())
                .volunteerId(t.getVolunteer().getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .priority(t.getPriority())
                .status(t.getStatus())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
