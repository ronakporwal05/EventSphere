package com.eventsphere.payment.controller;

import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.payment.dto.RazorpayOrderRequest;
import com.eventsphere.payment.dto.RazorpayOrderResponse;
import com.eventsphere.payment.dto.RazorpayVerifyRequest;
import com.eventsphere.payment.service.RazorpayService;
import com.eventsphere.ticket.dto.TicketResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments/razorpay")
@RequiredArgsConstructor
public class RazorpayController {

    private final RazorpayService razorpayService;

    @PostMapping("/order")
    public ResponseEntity<ApiResponse<RazorpayOrderResponse>> createOrder(
            @Valid @RequestBody RazorpayOrderRequest request) {
        RazorpayOrderResponse response = razorpayService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Razorpay order generated", response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<TicketResponse>> verifyPaymentAndIssueTicket(
            @Valid @RequestBody RazorpayVerifyRequest request) {
        TicketResponse ticket = razorpayService.verifyPaymentAndIssueTicket(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified and ticket pass issued", ticket));
    }
}
