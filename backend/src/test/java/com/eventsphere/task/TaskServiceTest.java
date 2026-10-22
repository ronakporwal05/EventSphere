package com.eventsphere.task;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.task.dto.TaskCreateRequest;
import com.eventsphere.task.dto.TaskResponse;
import com.eventsphere.task.entity.EventTask;
import com.eventsphere.task.repository.EventTaskRepository;
import com.eventsphere.task.service.TaskServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private EventTaskRepository taskRepository;
    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-task-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testCreateTaskSuccess() {
        Event mockEvent = Event.builder().id("event-100").tenantId("tenant-task-1").title("AI Summit 2026").build();

        when(eventRepository.findByIdAndTenantId("event-100", "tenant-task-1")).thenReturn(Optional.of(mockEvent));
        when(taskRepository.save(any(EventTask.class))).thenAnswer(i -> {
            EventTask t = i.getArgument(0);
            t.setId("task-555");
            return t;
        });

        TaskCreateRequest request = TaskCreateRequest.builder()
                .eventId("event-100")
                .title("Finalize Stage AV Setup")
                .priority("HIGH")
                .build();

        TaskResponse response = taskService.createTask(request);

        assertNotNull(response);
        assertEquals("Finalize Stage AV Setup", response.getTitle());
        assertEquals("HIGH", response.getPriority());
    }
}
