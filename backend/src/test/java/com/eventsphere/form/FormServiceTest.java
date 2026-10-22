package com.eventsphere.form;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.form.dto.FormCreateRequest;
import com.eventsphere.form.dto.FormFieldDTO;
import com.eventsphere.form.dto.FormSectionDTO;
import com.eventsphere.form.entity.FieldType;
import com.eventsphere.form.entity.RegistrationForm;
import com.eventsphere.form.repository.FormResponseRepository;
import com.eventsphere.form.repository.RegistrationFormRepository;
import com.eventsphere.form.service.FormServiceImpl;
import com.eventsphere.registration.repository.RegistrationRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FormServiceTest {

    @Mock
    private RegistrationFormRepository formRepository;
    @Mock
    private FormResponseRepository formResponseRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private RegistrationRepository registrationRepository;

    @InjectMocks
    private FormServiceImpl formService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-form-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testCreateFormSuccess() {
        Event mockEvent = Event.builder().id("evt-10").tenantId("tenant-form-1").title("Hackathon 2026").build();
        when(eventRepository.findByIdAndTenantId("evt-10", "tenant-form-1")).thenReturn(Optional.of(mockEvent));
        when(formRepository.findByTenantIdAndEventIdAndDeletedFalseOrderByVersionDesc("tenant-form-1", "evt-10")).thenReturn(Collections.emptyList());
        when(formRepository.save(any(RegistrationForm.class))).thenAnswer(i -> {
            RegistrationForm f = i.getArgument(0);
            f.setId("form-100");
            return f;
        });

        FormFieldDTO fieldDTO = FormFieldDTO.builder()
                .fieldName("githubProfile")
                .fieldLabel("GitHub Profile URL")
                .fieldType(FieldType.GITHUB)
                .required(true)
                .build();

        FormSectionDTO sectionDTO = FormSectionDTO.builder()
                .title("Developer Information")
                .fields(List.of(fieldDTO))
                .build();

        FormCreateRequest request = FormCreateRequest.builder()
                .eventId("evt-10")
                .title("Hackathon Application Form")
                .published(true)
                .sections(List.of(sectionDTO))
                .build();

        RegistrationForm result = formService.createOrUpdateForm(request);

        assertNotNull(result);
        assertEquals(1, result.getVersion());
        assertEquals("Hackathon Application Form", result.getTitle());
    }
}
