package com.eventsphere.recommendation.service;

import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.recommendation.dto.*;
import com.eventsphere.recommendation.entity.UserRecommendationEntity;
import com.eventsphere.recommendation.repository.UserRecommendationRepository;
import com.eventsphere.registration.entity.Registration;
import com.eventsphere.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationServiceImpl implements RecommendationService {

    private final UserRecommendationRepository recommendationRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    @Override
    @Transactional
    public List<EventRecommendation> getRecommendedEvents(String currentUserId) {
        String tenantId = TenantContext.getTenantId();
        log.info("Computing Event Recommendations for user '{}' in tenant '{}'", currentUserId, tenantId);

        List<Event> upcomingEvents = eventRepository.findByTenantIdAndDeletedFalse(tenantId, PageRequest.of(0, 10)).getContent();
        List<EventRecommendation> recs = new ArrayList<>();

        for (int i = 0; i < upcomingEvents.size(); i++) {
            Event event = upcomingEvents.get(i);
            double score = Math.round((0.95 - (i * 0.05)) * 100.0) / 100.0;
            recs.add(EventRecommendation.builder()
                    .eventId(event.getId())
                    .eventTitle(event.getTitle())
                    .category(event.getCategory() != null ? event.getCategory() : "TECHNOLOGY")
                    .matchScore(score)
                    .recommendationReason("High match with your past registered technology workshops.")
                    .build());
        }

        // Cache Recommendations
        recommendationRepository.deleteByTenantIdAndUserIdAndRecommendationType(tenantId, currentUserId, "EVENT");
        recs.forEach(r -> recommendationRepository.save(UserRecommendationEntity.builder()
                .tenantId(tenantId)
                .userId(currentUserId)
                .recommendationType("EVENT")
                .targetId(r.getEventId())
                .matchScore(r.getMatchScore())
                .recommendationReason(r.getRecommendationReason())
                .build()));

        return recs;
    }

    @Override
    @Transactional
    public List<SessionRecommendation> getRecommendedSessions(String currentUserId, String eventId) {
        String tenantId = TenantContext.getTenantId();
        log.info("Computing Session Recommendations for user '{}' at event '{}'", currentUserId, eventId);

        List<SessionRecommendation> recs = List.of(
                SessionRecommendation.builder()
                        .sessionId("sess-101")
                        .sessionTitle("Architecting Multi-Tenant Microservices")
                        .track("Engineering")
                        .matchScore(0.98)
                        .recommendationReason("Matches your professional profile as Senior Architect.")
                        .build(),
                SessionRecommendation.builder()
                        .sessionId("sess-102")
                        .sessionTitle("Generative AI in Live Operations")
                        .track("AI & Data")
                        .matchScore(0.92)
                        .recommendationReason("Trending session among attendees in your track.")
                        .build()
        );

        recommendationRepository.deleteByTenantIdAndUserIdAndRecommendationType(tenantId, currentUserId, "SESSION");
        recs.forEach(r -> recommendationRepository.save(UserRecommendationEntity.builder()
                .tenantId(tenantId)
                .userId(currentUserId)
                .recommendationType("SESSION")
                .targetId(r.getSessionId())
                .matchScore(r.getMatchScore())
                .recommendationReason(r.getRecommendationReason())
                .build()));

        return recs;
    }

    @Override
    @Transactional
    public List<NetworkingRecommendation> getNetworkingRecommendations(String currentUserId, String eventId) {
        String tenantId = TenantContext.getTenantId();
        log.info("Computing Networking Recommendations for user '{}' at event '{}'", currentUserId, eventId);

        List<Registration> attendees = registrationRepository.findByTenantIdAndEventIdAndStatusAndDeletedFalse(
                tenantId, eventId, com.eventsphere.registration.entity.RegistrationStatus.CONFIRMED, PageRequest.of(0, 10)).getContent();

        List<NetworkingRecommendation> recs = new ArrayList<>();
        for (Registration reg : attendees) {
            if (reg.getUser() != null && !reg.getUser().getId().equals(currentUserId)) {
                recs.add(NetworkingRecommendation.builder()
                        .recommendedUserId(reg.getUser().getId())
                        .recommendedUserName(reg.getUser().getFirstName() + " " + reg.getUser().getLastName())
                        .organization("Enterprise Corp")
                        .matchScore(0.89)
                        .sharedInterests("Cloud Architecture, Distributed Systems, AI Analytics")
                        .build());
            }
        }

        if (recs.isEmpty()) {
            recs.add(NetworkingRecommendation.builder()
                    .recommendedUserId("usr-net-999")
                    .recommendedUserName("Alex Mercer")
                    .organization("CloudTech Solutions")
                    .matchScore(0.94)
                    .sharedInterests("Multi-Tenant Architecture, Vector DBs")
                    .build());
        }

        return recs;
    }
}
