package com.eventsphere.feedback;

import com.eventsphere.ai.provider.LlmProvider;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.feedback.dto.FeedbackResponse;
import com.eventsphere.feedback.dto.FeedbackSentimentResponse;
import com.eventsphere.feedback.dto.FeedbackSubmitRequest;
import com.eventsphere.feedback.entity.EventFeedback;
import com.eventsphere.feedback.entity.FeedbackSentimentSummary;
import com.eventsphere.feedback.repository.EventFeedbackRepository;
import com.eventsphere.feedback.repository.FeedbackSentimentSummaryRepository;
import com.eventsphere.feedback.service.AiFeedbackServiceImpl;
import com.eventsphere.registration.repository.RegistrationRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiFeedbackServiceTest {

    @Mock
    private EventFeedbackRepository feedbackRepository;
    @Mock
    private FeedbackSentimentSummaryRepository summaryRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private RegistrationRepository registrationRepository;
    @Mock
    private LlmProvider llmProvider;

    @InjectMocks
    private AiFeedbackServiceImpl feedbackService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-fb-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testSubmitFeedbackPositiveClassification() {
        Event mockEvent = Event.builder().id("evt-fb-1").tenantId("tenant-fb-1").title("Developer Summit").build();
        when(eventRepository.findByIdAndTenantId("evt-fb-1", "tenant-fb-1")).thenReturn(Optional.of(mockEvent));

        when(feedbackRepository.save(any(EventFeedback.class))).thenAnswer(i -> {
            EventFeedback f = i.getArgument(0);
            f.setId("fb-100");
            return f;
        });

        FeedbackSubmitRequest request = FeedbackSubmitRequest.builder()
                .eventId("evt-fb-1")
                .rating(5)
                .category("SPEAKERS")
                .comment("Outstanding talks and great Q&A session!")
                .build();

        FeedbackResponse response = feedbackService.submitFeedback(request);

        assertNotNull(response);
        assertEquals("POSITIVE", response.getSentiment());
        assertEquals("DELIGHTED", response.getEmotion());
        verify(feedbackRepository, times(1)).save(any(EventFeedback.class));
    }

    @Test
    void testAnalyzeEventFeedbackSentimentSuccess() {
        Event mockEvent = Event.builder().id("evt-fb-1").tenantId("tenant-fb-1").title("Developer Summit").build();
        when(eventRepository.findByIdAndTenantId("evt-fb-1", "tenant-fb-1")).thenReturn(Optional.of(mockEvent));

        EventFeedback fb1 = EventFeedback.builder().id("fb-1").rating(5).sentiment("POSITIVE").comment("Great event!").build();
        EventFeedback fb2 = EventFeedback.builder().id("fb-2").rating(2).sentiment("NEGATIVE").comment("Long lines.").build();

        when(feedbackRepository.findByTenantIdAndEventId("tenant-fb-1", "evt-fb-1")).thenReturn(List.of(fb1, fb2));
        when(llmProvider.generateCompletion(anyString(), anyString())).thenReturn(new LlmProvider.LlmResponse("1. Optimize check-in counter staffing.\n2. Expand venue seating.", 100, 30));

        FeedbackSentimentResponse response = feedbackService.analyzeEventFeedbackSentiment("evt-fb-1");

        assertNotNull(response);
        assertEquals(2, response.getTotalFeedbackCount());
        assertEquals(3.5, response.getAverageRating());
        assertEquals(1, response.getPositiveCount());
        assertEquals(1, response.getNegativeCount());
        verify(summaryRepository, times(1)).save(any(FeedbackSentimentSummary.class));
    }
}
