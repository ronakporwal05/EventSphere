package com.eventsphere.qr.service;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.qr.dto.QrGenerateResponse;
import com.eventsphere.qr.dto.QrValidationRequest;
import com.eventsphere.qr.dto.QrValidationResult;
import com.eventsphere.ticket.entity.Ticket;
import com.eventsphere.ticket.entity.TicketStatus;
import com.eventsphere.ticket.repository.TicketRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrValidationServiceImpl implements QrValidationService {

    private final TicketRepository ticketRepository;

    @Value("${jwt.secret:EventSphereSuperSecretSecureSigningKey32BytesMinLength!}")
    private String jwtSecret;

    // Cache of scanned nonces for replay attack protection
    private final Set<String> processedNonces = ConcurrentHashMap.newKeySet();

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    @Transactional
    public QrGenerateResponse generateQrTokenForTicket(String ticketId) {
        String tenantId = TenantContext.getTenantId();
        Ticket ticket = ticketRepository.findByIdAndTenantIdAndDeletedFalse(ticketId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));

        if (ticket.getStatus() == TicketStatus.REVOKED || ticket.getStatus() == TicketStatus.EXPIRED) {
            throw new ResourceConflictException("Cannot generate QR code for ticket in status: " + ticket.getStatus());
        }

        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(300); // QR dynamic token valid for 5 minutes
        String nonce = UUID.randomUUID().toString();

        String qrToken = Jwts.builder()
                .subject(ticket.getId())
                .claim("ticketId", ticket.getId())
                .claim("registrationId", ticket.getRegistration().getId())
                .claim("eventId", ticket.getEvent().getId())
                .claim("tenantId", tenantId)
                .claim("nonce", nonce)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(getSigningKey())
                .compact();

        log.info("Generated secure QR token for ticket ID: {}", ticketId);
        return QrGenerateResponse.builder()
                .ticketId(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .qrToken(qrToken)
                .expiresAt(expiresAt)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public QrValidationResult validateQrToken(QrValidationRequest request) {
        Instant scannedAt = Instant.now();
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(request.getQrToken())
                    .getPayload();

            String ticketId = claims.get("ticketId", String.class);
            String registrationId = claims.get("registrationId", String.class);
            String eventId = claims.get("eventId", String.class);
            String tenantId = claims.get("tenantId", String.class);
            String nonce = claims.get("nonce", String.class);

            // Replay Attack & Duplicate Scan Protection Check
            if (processedNonces.contains(nonce)) {
                return QrValidationResult.builder()
                        .valid(false)
                        .message("REPLAY ATTACK DETECTED: This QR token nonce has already been scanned.")
                        .scannedAt(scannedAt)
                        .build();
            }

            // Expiry Check
            if (claims.getExpiration().before(Date.from(scannedAt))) {
                return QrValidationResult.builder()
                        .valid(false)
                        .message("EXPIRED TOKEN: QR token expired at " + claims.getExpiration())
                        .scannedAt(scannedAt)
                        .build();
            }

            Ticket ticket = ticketRepository.findByIdAndTenantIdAndDeletedFalse(ticketId, tenantId)
                    .orElse(null);

            if (ticket == null) {
                return QrValidationResult.builder()
                        .valid(false)
                        .message("INVALID TICKET: Ticket ID not found or deleted.")
                        .scannedAt(scannedAt)
                        .build();
            }

            if (ticket.getStatus() == TicketStatus.REVOKED) {
                return QrValidationResult.builder()
                        .valid(false)
                        .message("REVOKED TICKET: This ticket has been revoked.")
                        .scannedAt(scannedAt)
                        .build();
            }

            // Mark nonce as processed
            processedNonces.add(nonce);

            log.info("Successfully validated QR token for ticket ID: {}", ticketId);
            return QrValidationResult.builder()
                    .valid(true)
                    .message("QR Code Validated Successfully")
                    .ticketId(ticketId)
                    .registrationId(registrationId)
                    .eventId(eventId)
                    .tenantId(tenantId)
                    .attendeeName(ticket.getRegistration().getAttendeeName())
                    .attendeeEmail(ticket.getRegistration().getAttendeeEmail())
                    .ticketTypeName(ticket.getTicketType().getName())
                    .scannedAt(scannedAt)
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse or validate QR JWT Token", e);
            return QrValidationResult.builder()
                    .valid(false)
                    .message("INVALID SIGNATURE: " + e.getMessage())
                    .scannedAt(scannedAt)
                    .build();
        }
    }
}
