package com.eventsphere.form.service;

import com.eventsphere.form.dto.FormCreateRequest;
import com.eventsphere.form.dto.FormResponseDTO;
import com.eventsphere.form.dto.FormSubmitRequest;
import com.eventsphere.form.entity.RegistrationForm;

import java.util.List;

public interface FormService {

    RegistrationForm createOrUpdateForm(FormCreateRequest request);

    RegistrationForm getPublishedFormByEvent(String eventId);

    RegistrationForm getFormById(String id);

    List<RegistrationForm> getFormVersionsByEvent(String eventId);

    FormResponseDTO submitFormResponse(FormSubmitRequest request);

    FormResponseDTO getFormResponseByRegistration(String registrationId);
}
