package com.eventsphere.speaker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpeakerResponse {
    private String id;
    private String userId;
    private String fullName;
    private String email;
    private String title;
    private String organization;
    private String bio;
    private String photoUrl;
    private String linkedinUrl;
    private String twitterUrl;
    private Instant createdAt;
}
