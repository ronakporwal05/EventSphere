package com.eventsphere.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderRequest {
    private String eventId;
    private String ticketTypeId;
    private String tierName;
    private BigDecimal amount; // in INR
    private String currency; // "INR"
    private String userEmail;
    private String userName;
}
