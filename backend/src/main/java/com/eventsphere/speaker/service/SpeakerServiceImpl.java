package com.eventsphere.speaker.service;

import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.speaker.dto.SpeakerRequest;
import com.eventsphere.speaker.dto.SpeakerResponse;
import com.eventsphere.speaker.entity.Speaker;
import com.eventsphere.speaker.repository.SpeakerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpeakerServiceImpl implements SpeakerService {

    private final SpeakerRepository speakerRepository;

    @Override
    @Transactional
    public SpeakerResponse createSpeaker(SpeakerRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating speaker '{}' for tenant '{}'", request.getFullName(), tenantId);

        Speaker speaker = Speaker.builder()
                .tenantId(tenantId)
                .userId(request.getUserId())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .title(request.getTitle())
                .organization(request.getOrganization())
                .bio(request.getBio())
                .photoUrl(request.getPhotoUrl())
                .linkedinUrl(request.getLinkedinUrl())
                .twitterUrl(request.getTwitterUrl())
                .build();

        Speaker saved = speakerRepository.save(speaker);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SpeakerResponse getSpeakerById(String id) {
        String tenantId = TenantContext.getTenantId();
        Speaker speaker = speakerRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Speaker not found with ID: " + id));
        return mapToResponse(speaker);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SpeakerResponse> getSpeakers(Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return speakerRepository.findByTenantIdAndDeletedFalse(tenantId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public SpeakerResponse updateSpeaker(String id, SpeakerRequest request) {
        String tenantId = TenantContext.getTenantId();
        Speaker speaker = speakerRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Speaker not found with ID: " + id));

        speaker.setFullName(request.getFullName());
        speaker.setEmail(request.getEmail());
        speaker.setTitle(request.getTitle());
        speaker.setOrganization(request.getOrganization());
        speaker.setBio(request.getBio());
        speaker.setPhotoUrl(request.getPhotoUrl());
        speaker.setLinkedinUrl(request.getLinkedinUrl());
        speaker.setTwitterUrl(request.getTwitterUrl());

        Speaker saved = speakerRepository.save(speaker);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteSpeaker(String id) {
        String tenantId = TenantContext.getTenantId();
        Speaker speaker = speakerRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Speaker not found with ID: " + id));

        speaker.setDeleted(true);
        speakerRepository.save(speaker);
        log.info("Soft-deleted speaker ID: {}", id);
    }

    private SpeakerResponse mapToResponse(Speaker spk) {
        return SpeakerResponse.builder()
                .id(spk.getId())
                .userId(spk.getUserId())
                .fullName(spk.getFullName())
                .email(spk.getEmail())
                .title(spk.getTitle())
                .organization(spk.getOrganization())
                .bio(spk.getBio())
                .photoUrl(spk.getPhotoUrl())
                .linkedinUrl(spk.getLinkedinUrl())
                .twitterUrl(spk.getTwitterUrl())
                .createdAt(spk.getCreatedAt())
                .build();
    }
}
