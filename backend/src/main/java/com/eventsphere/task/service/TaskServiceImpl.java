package com.eventsphere.task.service;

import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.task.dto.TaskCreateRequest;
import com.eventsphere.task.dto.TaskResponse;
import com.eventsphere.task.dto.TaskUpdateRequest;
import com.eventsphere.task.entity.EventTask;
import com.eventsphere.task.repository.EventTaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {

    private final EventTaskRepository taskRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional
    public TaskResponse createTask(TaskCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating task '{}' for event '{}'", request.getTitle(), request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        EventTask task = EventTask.builder()
                .tenantId(tenantId)
                .event(event)
                .title(request.getTitle())
                .description(request.getDescription())
                .assigneeUserId(request.getAssigneeUserId())
                .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
                .status("TODO")
                .dueDate(request.getDueDate())
                .build();

        EventTask saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(String id) {
        String tenantId = TenantContext.getTenantId();
        EventTask task = taskRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));
        return mapToResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByEvent(String eventId, Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return taskRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(String id, TaskUpdateRequest request) {
        String tenantId = TenantContext.getTenantId();
        EventTask task = taskRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getAssigneeUserId() != null) task.setAssigneeUserId(request.getAssigneeUserId());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());

        EventTask saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteTask(String id) {
        String tenantId = TenantContext.getTenantId();
        EventTask task = taskRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));

        task.setDeleted(true);
        taskRepository.save(task);
        log.info("Soft-deleted task ID: {}", id);
    }

    private TaskResponse mapToResponse(EventTask t) {
        return TaskResponse.builder()
                .id(t.getId())
                .eventId(t.getEvent().getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .assigneeUserId(t.getAssigneeUserId())
                .priority(t.getPriority())
                .status(t.getStatus())
                .dueDate(t.getDueDate())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
