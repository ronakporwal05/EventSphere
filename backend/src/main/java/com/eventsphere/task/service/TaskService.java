package com.eventsphere.task.service;

import com.eventsphere.task.dto.TaskCreateRequest;
import com.eventsphere.task.dto.TaskResponse;
import com.eventsphere.task.dto.TaskUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {

    TaskResponse createTask(TaskCreateRequest request);

    TaskResponse getTaskById(String id);

    Page<TaskResponse> getTasksByEvent(String eventId, Pageable pageable);

    TaskResponse updateTask(String id, TaskUpdateRequest request);

    void deleteTask(String id);
}
