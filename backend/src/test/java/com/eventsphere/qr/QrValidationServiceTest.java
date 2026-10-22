package com.eventsphere.qr;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.qr.dto.QrGenerateResponse;
import com.eventsphere.qr.dto.QrValidationRequest;
import com.eventsphere.qr.dto.QrValidationResult;
import com.eventsphere.qr.service.QrValidationServiceImpl;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.ticket.entity.Ticket;
import com.eventsphere.ticket.entity.TicketStatus;
import com.eventsphere.ticket.entity.TicketType;
import com.eventsphere.ticket.repository.TicketRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QrValidationServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private QrValidationServiceImpl qrValidationService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-qr-1");
        ReflectionTestUtils.setField(qrValidationService, "jwtSecret", "SuperSecretSigningKeyMustBe32BytesOrLongerForHmacSha256!");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testGenerateAndValidateQrTokenSuccess() {
        Event mockEvent = Event.builder().id("evt-qr").tenantId("tenant-qr-1").title("QR Fest").build();
        Registration mockReg = Registration.builder().id("reg-qr").tenantId("tenant-qr-1").attendeeName("Charlie Brown").attendeeEmail("charlie@peanuts.com").build();
        TicketType mockType = TicketType.builder().id("tt-qr").name("General Admission").price(BigDecimal.TEN).build();

        Ticket mockTicket = Ticket.builder()
                .id("tck-qr-100")
                .tenantId("tenant-qr-1")
                .event(mockEvent)
                .registration(mockReg)
                .ticketType(mockType)
                .ticketNumber("TCK-QR-999")
                .status(TicketStatus.ISSUED)
                .build();

        when(ticketRepository.findByIdAndTenantIdAndDeletedFalse("tck-qr-100", "tenant-qr-1")).thenReturn(Optional.of(mockTicket));

        QrGenerateResponse genResponse = qrValidationService.generateQrTokenForTicket("tck-qr-100");
        assertNotNull(genResponse);
        assertNotNull(genResponse.getQrToken());

        QrValidationRequest valRequest = QrValidationRequest.builder().qrToken(genResponse.getQrToken()).build();
        QrValidationResult valResult = qrValidationService.validateQrToken(valRequest);

        assertTrue(valResult.isValid());
        assertEquals("Charlie Brown", valResult.getAttendeeName());
        assertEquals("tck-qr-100", valResult.getTicketId());

        // Test Replay Attack
        QrValidationResult replayResult = qrValidationService.validateQrToken(valRequest);
        assertFalse(replayResult.isValid());
        assertTrue(replayResult.getMessage().contains("REPLAY ATTACK DETECTED"));
    }
}
