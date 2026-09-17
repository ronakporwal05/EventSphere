package com.eventsphere.session.service;

import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.event.entity.Event;
import com.eventsphere.event.repository.EventRepository;
import com.eventsphere.session.dto.SessionCreateRequest;
import com.eventsphere.session.dto.SessionResponse;
import com.eventsphere.session.dto.SpeakerAssignRequest;
import com.eventsphere.session.entity.Session;
import com.eventsphere.session.repository.SessionRepository;
import com.eventsphere.venue.entity.Room;
import com.eventsphere.venue.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;

    @Override
    @Transactional
    public SessionResponse createSession(SessionCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating session '{}' for event '{}'", request.getTitle(), request.getEventId());

        Event event = eventRepository.findByIdAndTenantId(request.getEventId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        Room room = null;
        if (request.getRoomId() != null) {
            room = roomRepository.findByIdAndTenantId(request.getRoomId(), tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + request.getRoomId()));

            // Conflict detection for room double-booking
            List<Session> conflicts = sessionRepository.findConflictingRoomSessions(tenantId, request.getRoomId(), request.getStartTime(), request.getEndTime());
            if (!conflicts.isEmpty()) {
                throw new ResourceConflictException("Room '" + room.getName() + "' is already booked during the specified time slot");
            }
        }

        Session session = Session.builder()
                .tenantId(tenantId)
                .event(event)
                .room(room)
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .capacity(request.getCapacity() > 0 ? request.getCapacity() : (room != null ? room.getCapacity() : 0))
                .status("SCHEDULED")
                .speakerUserIds(request.getSpeakerUserIds() != null ? request.getSpeakerUserIds() : new HashSet<>())
                .build();

        Session saved = sessionRepository.save(session);
        return mapToSessionResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SessionResponse getSessionById(String id) {
        String tenantId = TenantContext.getTenantId();
        Session session = sessionRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + id));
        return mapToSessionResponse(session);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionResponse> getSessionsByEvent(String eventId) {
        String tenantId = TenantContext.getTenantId();
        return sessionRepository.findByTenantIdAndEventId(tenantId, eventId).stream()
                .map(this::mapToSessionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SessionResponse updateSession(String id, SessionCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        Session session = sessionRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + id));

        if (request.getRoomId() != null && !request.getRoomId().equals(session.getRoom() != null ? session.getRoom().getId() : null)) {
            Room room = roomRepository.findByIdAndTenantId(request.getRoomId(), tenantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + request.getRoomId()));

            List<Session> conflicts = sessionRepository.findConflictingRoomSessions(tenantId, request.getRoomId(), request.getStartTime(), request.getEndTime());
            conflicts.removeIf(s -> s.getId().equals(id));
            if (!conflicts.isEmpty()) {
                throw new ResourceConflictException("Room '" + room.getName() + "' is already booked during the specified time slot");
            }
            session.setRoom(room);
        }

        session.setTitle(request.getTitle());
        session.setDescription(request.getDescription());
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        session.setCapacity(request.getCapacity());
        if (request.getSpeakerUserIds() != null) {
            session.setSpeakerUserIds(request.getSpeakerUserIds());
        }

        Session saved = sessionRepository.save(session);
        return mapToSessionResponse(saved);
    }

    @Override
    @Transactional
    public SessionResponse assignSpeakers(String id, SpeakerAssignRequest request) {
        String tenantId = TenantContext.getTenantId();
        Session session = sessionRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + id));

        session.setSpeakerUserIds(request.getSpeakerUserIds());
        Session saved = sessionRepository.save(session);
        return mapToSessionResponse(saved);
    }

    @Override
    @Transactional
    public void deleteSession(String id) {
        String tenantId = TenantContext.getTenantId();
        Session session = sessionRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + id));
        sessionRepository.delete(session);
    }

    private SessionResponse mapToSessionResponse(Session session) {
        return SessionResponse.builder()
                .id(session.getId())
                .eventId(session.getEvent().getId())
                .roomId(session.getRoom() != null ? session.getRoom().getId() : null)
                .roomName(session.getRoom() != null ? session.getRoom().getName() : null)
                .title(session.getTitle())
                .description(session.getDescription())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .capacity(session.getCapacity())
                .status(session.getStatus())
                .speakerUserIds(session.getSpeakerUserIds())
                .createdAt(session.getCreatedAt())
                .build();
    }
}
