package com.eventsphere.pricing.service;

import com.eventsphere.pricing.dto.DynamicPricingRecommendation;

public interface DynamicPricingService {
    DynamicPricingRecommendation calculateRecommendedPricing(String eventId);
}
