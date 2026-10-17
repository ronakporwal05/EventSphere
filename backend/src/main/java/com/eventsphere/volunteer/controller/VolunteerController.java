package com.eventsphere.volunteer.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import com.eventsphere.volunteer.dto.*;
import com.eventsphere.volunteer.service.VolunteerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/volunteers")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;

    @PostMapping("/apply")
    @Auditable(action = "VOLUNTEER_APPLY", entityType = "VOLUNTEER")
    public ResponseEntity<ApiResponse<VolunteerResponse>> applyVolunteer(@Valid @RequestBody VolunteerApplyRequest request) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        VolunteerResponse response = volunteerService.applyVolunteer(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Volunteer application submitted", response));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "VOLUNTEER_STATUS_UPDATE", entityType = "VOLUNTEER")
    public ResponseEntity<ApiResponse<VolunteerResponse>> updateVolunteerStatus(
            @PathVariable("id") String id,
            @RequestParam("status") String status,
            @RequestParam(value = "role", required = false) String role) {
        VolunteerResponse response = volunteerService.updateVolunteerStatus(id, status, role);
        return ResponseEntity.ok(ApiResponse.success("Volunteer status updated", response));
    }

    @PutMapping("/{id}/scanner-mode")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "VOLUNTEER_SCANNER_MODE_TOGGLE", entityType = "VOLUNTEER")
    public ResponseEntity<ApiResponse<VolunteerResponse>> toggleScannerMode(
            @PathVariable("id") String id,
            @RequestParam("enabled") boolean enabled) {
        VolunteerResponse response = volunteerService.toggleScannerMode(id, enabled);
        return ResponseEntity.ok(ApiResponse.success("Scanner mode updated", response));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<PagedResponse<VolunteerResponse>> getVolunteersByEvent(@PathVariable("eventId") String eventId, Pageable pageable) {
        Page<VolunteerResponse> page = volunteerService.getVolunteersByEvent(eventId, pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Volunteers retrieved successfully"));
    }

    @PostMapping("/shifts")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "ASSIGN_VOLUNTEER_SHIFT", entityType = "VOLUNTEER_SHIFT")
    public ResponseEntity<ApiResponse<ShiftResponse>> assignShift(@Valid @RequestBody ShiftCreateRequest request) {
        ShiftResponse response = volunteerService.assignShift(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Shift assigned successfully", response));
    }

    @GetMapping("/{id}/shifts")
    public ResponseEntity<ApiResponse<List<ShiftResponse>>> getVolunteerShifts(@PathVariable("id") String id) {
        List<ShiftResponse> list = volunteerService.getVolunteerShifts(id);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/tasks")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "ASSIGN_VOLUNTEER_TASK", entityType = "VOLUNTEER_TASK")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(@Valid @RequestBody TaskCreateRequest request) {
        TaskResponse response = volunteerService.assignTask(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task assigned successfully", response));
    }

    @PutMapping("/tasks/{taskId}/status")
    @Auditable(action = "UPDATE_VOLUNTEER_TASK_STATUS", entityType = "VOLUNTEER_TASK")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @PathVariable("taskId") String taskId,
            @RequestParam("status") String status) {
        TaskResponse response = volunteerService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(ApiResponse.success("Task status updated", response));
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getVolunteerTasks(@PathVariable("id") String id) {
        List<TaskResponse> list = volunteerService.getVolunteerTasks(id);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}/performance")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<VolunteerPerformanceResponse>> getVolunteerPerformance(@PathVariable("id") String id) {
        VolunteerPerformanceResponse response = volunteerService.getVolunteerPerformance(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
