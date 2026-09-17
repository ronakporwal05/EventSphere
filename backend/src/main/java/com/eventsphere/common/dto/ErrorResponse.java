package com.eventsphere.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    private boolean success;
    private String errorCode;
    private String message;
    private List<String> details;
    private String path;
    @Builder.Default
    private String timestamp = Instant.now().toString();

    public static ErrorResponse of(String errorCode, String message, List<String> details, String path) {
        return ErrorResponse.builder()
                .success(false)
                .errorCode(errorCode)
                .message(message)
                .details(details)
                .path(path)
                .timestamp(Instant.now().toString())
                .build();
    }
}
