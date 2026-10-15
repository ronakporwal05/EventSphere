package com.eventsphere.pricing.controller;

import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.pricing.dto.DynamicPricingRecommendation;
import com.eventsphere.pricing.service.DynamicPricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pricing")
@RequiredArgsConstructor
public class DynamicPricingController {

    private final DynamicPricingService dynamicPricingService;

    @GetMapping("/recommendation/{eventId}")
    public ResponseEntity<ApiResponse<DynamicPricingRecommendation>> getPricingRecommendation(
            @PathVariable("eventId") String eventId) {
        DynamicPricingRecommendation recommendation = dynamicPricingService.calculateRecommendedPricing(eventId);
        return ResponseEntity.ok(ApiResponse.success(recommendation));
    }
}
