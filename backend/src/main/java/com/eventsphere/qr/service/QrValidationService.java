package com.eventsphere.qr.service;

import com.eventsphere.qr.dto.QrGenerateResponse;
import com.eventsphere.qr.dto.QrValidationRequest;
import com.eventsphere.qr.dto.QrValidationResult;

public interface QrValidationService {

    QrGenerateResponse generateQrTokenForTicket(String ticketId);

    QrValidationResult validateQrToken(QrValidationRequest request);
}
