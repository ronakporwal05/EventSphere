package com.eventsphere.payment.service;

import com.eventsphere.payment.dto.RazorpayOrderRequest;
import com.eventsphere.payment.dto.RazorpayOrderResponse;
import com.eventsphere.payment.dto.RazorpayVerifyRequest;
import com.eventsphere.ticket.dto.TicketResponse;

public interface RazorpayService {
    RazorpayOrderResponse createOrder(RazorpayOrderRequest request);
    TicketResponse verifyPaymentAndIssueTicket(RazorpayVerifyRequest request);
}
