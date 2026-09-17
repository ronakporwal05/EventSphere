package com.eventsphere.speaker.service;

import com.eventsphere.speaker.dto.SpeakerRequest;
import com.eventsphere.speaker.dto.SpeakerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SpeakerService {

    SpeakerResponse createSpeaker(SpeakerRequest request);

    SpeakerResponse getSpeakerById(String id);

    Page<SpeakerResponse> getSpeakers(Pageable pageable);

    SpeakerResponse updateSpeaker(String id, SpeakerRequest request);

    void deleteSpeaker(String id);
}
