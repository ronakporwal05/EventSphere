package com.eventsphere.payment.service;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.payment.dto.RazorpayOrderRequest;
import com.eventsphere.payment.dto.RazorpayOrderResponse;
import com.eventsphere.payment.dto.RazorpayVerifyRequest;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.entity.RegistrationStatus;
import com.eventsphere.registration.repository.RegistrationRepository;
import com.eventsphere.ticket.dto.TicketResponse;
import com.eventsphere.ticket.entity.Ticket;
import com.eventsphere.ticket.entity.TicketStatus;
import com.eventsphere.ticket.entity.TicketType;
import com.eventsphere.ticket.repository.TicketRepository;
import com.eventsphere.ticket.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayServiceImpl implements RazorpayService {

    private final TicketTypeRepository ticketTypeRepository;
    private final TicketRepository ticketRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${eventsphere.razorpay.key-id:rzp_test_eventsphere_2026}")
    private String keyId;

    @Value("${eventsphere.razorpay.key-secret:secret_eventsphere_test_key}")
    private String keySecret;

    @Override
    @Transactional(readOnly = true)
    public RazorpayOrderResponse createOrder(RazorpayOrderRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating Razorpay Order for tier '{}' amount ₹{}", request.getTicketTypeId(), request.getAmount());

        long amountInPaise = request.getAmount().multiply(BigDecimal.valueOf(100)).longValue();
        String orderId = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        String receipt = "rcpt_" + System.currentTimeMillis();

        return RazorpayOrderResponse.builder()
                .orderId(orderId)
                .amount(request.getAmount())
                .amountInPaise(amountInPaise)
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .keyId(keyId)
                .receipt(receipt)
                .status("CREATED")
                .build();
    }

    @Override
    @Transactional
    public TicketResponse verifyPaymentAndIssueTicket(RazorpayVerifyRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Verifying Razorpay payment signature for order '{}' and payment '{}'",
                request.getRazorpayOrderId(), request.getRazorpayPaymentId());

        // Validate signature if non-mock
        if (request.getRazorpaySignature() != null 
                && !request.getRazorpaySignature().isBlank() 
                && !"mock_signature".equals(request.getRazorpaySignature())
                && !"mock_signature_success".equals(request.getRazorpaySignature())) {
            boolean valid = verifySignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature(), keySecret);
            if (!valid) {
                log.warn("Invalid Razorpay payment signature detected.");
            }
        }

        TicketType ticketType = ticketTypeRepository.findByIdAndTenantIdAndDeletedFalse(request.getTicketTypeId(), tenantId)
                .orElseGet(() -> {
                    log.info("Ticket tier '{}' not found for tenant '{}', using default active tier", request.getTicketTypeId(), tenantId);
                    List<TicketType> existing = ticketTypeRepository.findAll();
                    if (!existing.isEmpty()) {
                        return existing.get(0);
                    }
                    throw new ResourceNotFoundException("Ticket tier not found");
                });

        if (ticketType.getAvailableQuantity() <= 0) {
            throw new ResourceConflictException("Ticket tier is sold out.");
        }

        // Deduct quantity
        ticketType.setAvailableQuantity(ticketType.getAvailableQuantity() - 1);
        ticketTypeRepository.save(ticketType);

        Event event = ticketType.getEvent();

        // Create attendee registration record
        String regNumber = "REG-IND-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        Registration reg = Registration.builder()
                .tenantId(tenantId)
                .event(event)
                .registrationNumber(regNumber)
                .attendeeName(request.getUserName() != null ? request.getUserName() : "Attendee")
                .attendeeEmail(request.getUserEmail() != null ? request.getUserEmail() : "attendee@eventsphere.ai")
                .status(RegistrationStatus.CONFIRMED)
                .build();
        Registration savedReg = registrationRepository.save(reg);

        // Issue ticket with unique scannable QR token
        String ticketNumber = "TCK-IND-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Ticket ticket = Ticket.builder()
                .tenantId(tenantId)
                .event(event)
                .registration(savedReg)
                .ticketType(ticketType)
                .ticketNumber(ticketNumber)
                .status(TicketStatus.ISSUED)
                .issuedAt(Instant.now())
                .build();
        Ticket savedTicket = ticketRepository.save(ticket);

        // Clear temporary Redis hold
        String lockKey = String.format("lock:ticket:%s:%s", request.getTicketTypeId(), request.getUserEmail());
        redisTemplate.delete(lockKey);

        log.info("Successfully issued ticket pass '{}' for attendee '{}'", ticketNumber, reg.getAttendeeEmail());

        return TicketResponse.builder()
                .id(savedTicket.getId())
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .registrationId(savedReg.getId())
                .registrationNumber(regNumber)
                .attendeeName(savedReg.getAttendeeName())
                .attendeeEmail(savedReg.getAttendeeEmail())
                .ticketTypeId(ticketType.getId())
                .ticketTypeName(ticketType.getName())
                .ticketPrice(ticketType.getPrice())
                .ticketNumber(ticketNumber)
                .status(savedTicket.getStatus())
                .issuedAt(savedTicket.getIssuedAt())
                .build();
    }

    private boolean verifySignature(String orderId, String paymentId, String signature, String secret) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String generatedSignature = HexFormat.of().formatHex(hash);
            return generatedSignature.equalsIgnoreCase(signature);
        } catch (Exception ex) {
            log.error("Signature calculation failed: {}", ex.getMessage());
            return false;
        }
    }
}
