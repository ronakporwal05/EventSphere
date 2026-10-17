package com.eventsphere.form.controller;

import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.form.dto.FormCreateRequest;
import com.eventsphere.form.dto.FormResponseDTO;
import com.eventsphere.form.dto.FormSubmitRequest;
import com.eventsphere.form.entity.RegistrationForm;
import com.eventsphere.form.service.FormService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/forms")
@RequiredArgsConstructor
public class FormController {

    private final FormService formService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_FORM_VERSION", entityType = "REGISTRATION_FORM")
    public ResponseEntity<ApiResponse<RegistrationForm>> createOrUpdateForm(@Valid @RequestBody FormCreateRequest request) {
        RegistrationForm form = formService.createOrUpdateForm(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration form version saved successfully", form));
    }

    @GetMapping("/event/{eventId}/published")
    public ResponseEntity<ApiResponse<RegistrationForm>> getPublishedFormByEvent(@PathVariable("eventId") String eventId) {
        RegistrationForm form = formService.getPublishedFormByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(form));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegistrationForm>> getFormById(@PathVariable("id") String id) {
        RegistrationForm form = formService.getFormById(id);
        return ResponseEntity.ok(ApiResponse.success(form));
    }

    @GetMapping("/event/{eventId}/versions")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    public ResponseEntity<ApiResponse<List<RegistrationForm>>> getFormVersionsByEvent(@PathVariable("eventId") String eventId) {
        List<RegistrationForm> versions = formService.getFormVersionsByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(versions));
    }

    @PostMapping("/submit")
    @Auditable(action = "SUBMIT_FORM_RESPONSE", entityType = "FORM_RESPONSE")
    public ResponseEntity<ApiResponse<FormResponseDTO>> submitFormResponse(@Valid @RequestBody FormSubmitRequest request) {
        FormResponseDTO response = formService.submitFormResponse(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Form response submitted successfully", response));
    }

    @GetMapping("/response/registration/{registrationId}")
    public ResponseEntity<ApiResponse<FormResponseDTO>> getFormResponseByRegistration(@PathVariable("registrationId") String registrationId) {
        FormResponseDTO response = formService.getFormResponseByRegistration(registrationId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
