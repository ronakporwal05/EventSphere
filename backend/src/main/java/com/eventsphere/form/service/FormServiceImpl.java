package com.eventsphere.form.service;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.form.dto.*;
import com.eventsphere.form.entity.*;
import com.eventsphere.form.repository.FormResponseRepository;
import com.eventsphere.form.repository.RegistrationFormRepository;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FormServiceImpl implements FormService {

    private final RegistrationFormRepository formRepository;
    private final FormResponseRepository formResponseRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    @Override
    @Transactional
    public RegistrationForm createOrUpdateForm(FormCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating dynamic form for event '{}'", request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        List<RegistrationForm> existingForms = formRepository.findByTenantIdAndEventIdAndDeletedFalseOrderByVersionDesc(tenantId, event.getId());
        int newVersion = existingForms.isEmpty() ? 1 : existingForms.get(0).getVersion() + 1;

        RegistrationForm form = RegistrationForm.builder()
                .tenantId(tenantId)
                .event(event)
                .title(request.getTitle())
                .description(request.getDescription())
                .version(newVersion)
                .published(request.getPublished() != null ? request.getPublished() : false)
                .build();

        if (request.getSections() != null) {
            for (FormSectionDTO sDto : request.getSections()) {
                FormSection section = FormSection.builder()
                        .form(form)
                        .title(sDto.getTitle())
                        .description(sDto.getDescription())
                        .displayOrder(sDto.getDisplayOrder())
                        .build();

                if (sDto.getFields() != null) {
                    for (FormFieldDTO fDto : sDto.getFields()) {
                        FormField field = FormField.builder()
                                .section(section)
                                .fieldName(fDto.getFieldName())
                                .fieldLabel(fDto.getFieldLabel())
                                .fieldType(fDto.getFieldType())
                                .placeholder(fDto.getPlaceholder())
                                .helpText(fDto.getHelpText())
                                .defaultValue(fDto.getDefaultValue())
                                .required(fDto.isRequired())
                                .regexPattern(fDto.getRegexPattern())
                                .minLength(fDto.getMinLength())
                                .maxLength(fDto.getMaxLength())
                                .minValue(fDto.getMinValue())
                                .maxValue(fDto.getMaxValue())
                                .conditionalParentFieldId(fDto.getConditionalParentFieldId())
                                .conditionalParentValue(fDto.getConditionalParentValue())
                                .displayOrder(fDto.getDisplayOrder())
                                .build();

                        if (fDto.getOptions() != null) {
                            for (FieldOptionDTO oDto : fDto.getOptions()) {
                                FieldOption option = FieldOption.builder()
                                        .field(field)
                                        .optionLabel(oDto.getOptionLabel())
                                        .optionValue(oDto.getOptionValue())
                                        .displayOrder(oDto.getDisplayOrder())
                                        .build();
                                field.getOptions().add(option);
                            }
                        }
                        section.getFields().add(field);
                    }
                }
                form.getSections().add(section);
            }
        }

        RegistrationForm saved = formRepository.save(form);
        log.info("Saved Registration Form version {} for event '{}'", newVersion, event.getId());
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public RegistrationForm getPublishedFormByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return formRepository.findByTenantIdAndEventIdAndPublishedTrueAndDeletedFalse(tenantId, eventId)
                .orElseThrow(() -> new ResourceNotFoundException("No published registration form found for event: " + eventId));
    }

    @Override
    @Transactional(readOnly = true)
    public RegistrationForm getFormById(String id) {
        String tenantId = TenantContext.getTenantId();
        return formRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration form not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationForm> getFormVersionsByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return formRepository.findByTenantIdAndEventIdAndDeletedFalseOrderByVersionDesc(tenantId, eventId);
    }

    @Override
    @Transactional
    public FormResponseDTO submitFormResponse(FormSubmitRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Submitting form response for registration '{}'", request.getRegistrationId());

        Registration reg = registrationRepository.findByIdAndTenantIdAndDeletedFalse(request.getRegistrationId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + request.getRegistrationId()));

        RegistrationForm form = formRepository.findByIdAndTenantIdAndDeletedFalse(request.getFormId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found with ID: " + request.getFormId()));

        // Validate submission answers against field rules
        Map<String, String> answersMap = request.getAnswers() != null ?
                request.getAnswers().stream().collect(Collectors.toMap(FormAnswerDTO::getFieldId, a -> a.getAnswerValue() != null ? a.getAnswerValue() : "")) : Map.of();

        List<FormField> allFields = form.getSections().stream()
                .flatMap(s -> s.getFields().stream())
                .collect(Collectors.toList());

        for (FormField field : allFields) {
            String val = answersMap.get(field.getId());

            // 1. Required validation
            if (field.isRequired() && (val == null || val.trim().isEmpty())) {
                throw new ResourceConflictException("Field '" + field.getFieldLabel() + "' is required.");
            }

            if (val != null && !val.trim().isEmpty()) {
                // 2. Regex validation
                if (field.getRegexPattern() != null && !field.getRegexPattern().isEmpty()) {
                    if (!Pattern.matches(field.getRegexPattern(), val)) {
                        throw new ResourceConflictException("Field '" + field.getFieldLabel() + "' value is invalid according to pattern.");
                    }
                }

                // 3. Min/Max Length validation
                if (field.getMinLength() != null && val.length() < field.getMinLength()) {
                    throw new ResourceConflictException("Field '" + field.getFieldLabel() + "' must be at least " + field.getMinLength() + " characters long.");
                }
                if (field.getMaxLength() != null && val.length() > field.getMaxLength()) {
                    throw new ResourceConflictException("Field '" + field.getFieldLabel() + "' cannot exceed " + field.getMaxLength() + " characters.");
                }

                // 4. Min/Max Value numeric validation
                if (field.getFieldType() == FieldType.NUMBER) {
                    try {
                        BigDecimal numVal = new BigDecimal(val);
                        if (field.getMinValue() != null && numVal.compareTo(field.getMinValue()) < 0) {
                            throw new ResourceConflictException("Field '" + field.getFieldLabel() + "' must be greater than or equal to " + field.getMinValue());
                        }
                        if (field.getMaxValue() != null && numVal.compareTo(field.getMaxValue()) > 0) {
                            throw new ResourceConflictException("Field '" + field.getFieldLabel() + "' cannot exceed " + field.getMaxValue());
                        }
                    } catch (NumberFormatException e) {
                        throw new ResourceConflictException("Field '" + field.getFieldLabel() + "' must be a valid number.");
                    }
                }
            }
        }

        FormResponse response = FormResponse.builder()
                .tenantId(tenantId)
                .form(form)
                .registration(reg)
                .build();

        if (request.getAnswers() != null) {
            for (FormAnswerDTO aDto : request.getAnswers()) {
                FormField field = allFields.stream()
                        .filter(f -> f.getId().equals(aDto.getFieldId()))
                        .findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Field not found with ID: " + aDto.getFieldId()));

                FormAnswer answer = FormAnswer.builder()
                        .response(response)
                        .field(field)
                        .answerValue(aDto.getAnswerValue())
                        .build();

                response.getAnswers().add(answer);
            }
        }

        FormResponse saved = formResponseRepository.save(response);
        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FormResponseDTO getFormResponseByRegistration(String registrationId) {
        String tenantId = TenantContext.getTenantId();
        FormResponse resp = formResponseRepository.findByTenantIdAndRegistrationIdAndDeletedFalse(tenantId, registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Form response not found for registration ID: " + registrationId));
        return mapToResponseDTO(resp);
    }

    private FormResponseDTO mapToResponseDTO(FormResponse resp) {
        List<FormAnswerDTO> answers = resp.getAnswers().stream()
                .map(a -> FormAnswerDTO.builder()
                        .fieldId(a.getField().getId())
                        .answerValue(a.getAnswerValue())
                        .build())
                .collect(Collectors.toList());

        return FormResponseDTO.builder()
                .id(resp.getId())
                .formId(resp.getForm().getId())
                .registrationId(resp.getRegistration().getId())
                .submittedAt(resp.getSubmittedAt())
                .answers(answers)
                .build();
    }
}
