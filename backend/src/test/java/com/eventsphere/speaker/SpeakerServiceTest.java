package com.eventsphere.speaker;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.speaker.dto.SpeakerRequest;
import com.eventsphere.speaker.dto.SpeakerResponse;
import com.eventsphere.speaker.entity.Speaker;
import com.eventsphere.speaker.repository.SpeakerRepository;
import com.eventsphere.speaker.service.SpeakerServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpeakerServiceTest {

    @Mock
    private SpeakerRepository speakerRepository;

    @InjectMocks
    private SpeakerServiceImpl speakerService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-spk-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testCreateSpeakerSuccess() {
        SpeakerRequest request = SpeakerRequest.builder()
                .fullName("Dr. Alan Turing")
                .email("alan@turing.org")
                .title("Chief AI Researcher")
                .organization("Bletchley Labs")
                .build();

        when(speakerRepository.save(any(Speaker.class))).thenAnswer(i -> {
            Speaker spk = i.getArgument(0);
            spk.setId("spk-123");
            return spk;
        });

        SpeakerResponse response = speakerService.createSpeaker(request);

        assertNotNull(response);
        assertEquals("Dr. Alan Turing", response.getFullName());
        assertEquals("alan@turing.org", response.getEmail());
    }
}
