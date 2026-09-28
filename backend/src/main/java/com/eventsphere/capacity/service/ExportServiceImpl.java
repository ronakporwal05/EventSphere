package com.eventsphere.capacity.service;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportServiceImpl implements ExportService {

    private final RegistrationRepository registrationRepository;

    @Override
    @Transactional(readOnly = true)
    public byte[] exportRegistrationsCsv(String eventId) {
        String tenantId = TenantContext.getTenantId();
        log.info("Generating CSV export for event '{}'", eventId);

        List<Registration> list = registrationRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, Pageable.unpaged()).getContent();

        StringBuilder sb = new StringBuilder();
        sb.append("Registration Number,Attendee Name,Attendee Email,Attendee Phone,Status,Registration Date\n");

        for (Registration reg : list) {
            sb.append("\"").append(reg.getRegistrationNumber()).append("\",");
            sb.append("\"").append(reg.getAttendeeName()).append("\",");
            sb.append("\"").append(reg.getAttendeeEmail()).append("\",");
            sb.append("\"").append(reg.getAttendeePhone() != null ? reg.getAttendeePhone() : "").append("\",");
            sb.append("\"").append(reg.getStatus()).append("\",");
            sb.append("\"").append(reg.getRegistrationDate()).append("\"\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportRegistrationsExcel(String eventId) {
        String tenantId = TenantContext.getTenantId();
        log.info("Generating Tabular TSV/Excel export for event '{}'", eventId);

        List<Registration> list = registrationRepository.findByTenantIdAndEventIdAndDeletedFalse(tenantId, eventId, Pageable.unpaged()).getContent();

        StringBuilder sb = new StringBuilder();
        sb.append("Registration Number\tAttendee Name\tAttendee Email\tAttendee Phone\tStatus\tRegistration Date\n");

        for (Registration reg : list) {
            sb.append(reg.getRegistrationNumber()).append("\t");
            sb.append(reg.getAttendeeName()).append("\t");
            sb.append(reg.getAttendeeEmail()).append("\t");
            sb.append(reg.getAttendeePhone() != null ? reg.getAttendeePhone() : "").append("\t");
            sb.append(reg.getStatus()).append("\t");
            sb.append(reg.getRegistrationDate()).append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }
}
