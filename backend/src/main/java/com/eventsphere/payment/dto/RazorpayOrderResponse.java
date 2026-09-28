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
public class RazorpayOrderResponse {
    private String orderId;
    private BigDecimal amount;
    private long amountInPaise;
    private String currency;
    private String keyId;
    private String receipt;
    private String status;
}
