package com.eventsphere.session.service;

import com.eventsphere.session.dto.SessionCreateRequest;
import com.eventsphere.session.dto.SessionResponse;
import com.eventsphere.session.dto.SpeakerAssignRequest;

import java.util.List;

public interface SessionService {

    SessionResponse createSession(SessionCreateRequest request);

    SessionResponse getSessionById(String id);

    List<SessionResponse> getSessionsByEvent(String eventId);

    SessionResponse updateSession(String id, SessionCreateRequest request);

    SessionResponse assignSpeakers(String id, SpeakerAssignRequest request);

    void deleteSession(String id);
}
