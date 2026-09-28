package com.eventsphere.registration.service;

import com.eventsphere.registration.dto.RegistrationRequest;
import com.eventsphere.registration.dto.RegistrationResponse;
import com.eventsphere.registration.dto.RegistrationStatusUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RegistrationService {

    RegistrationResponse registerAttendee(String userId, RegistrationRequest request);

    RegistrationResponse getRegistrationById(String id);

    RegistrationResponse getRegistrationByNumber(String registrationNumber);

    Page<RegistrationResponse> getRegistrationsByEvent(String eventId, Pageable pageable);

    RegistrationResponse updateRegistrationStatus(String id, RegistrationStatusUpdateRequest request);

    void cancelRegistration(String id, String reason);
}
