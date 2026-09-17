package com.eventsphere.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PagedResponse<T> {

    private boolean success;
    private String message;
    private List<T> data;
    private PaginationMetaData pagination;
    @Builder.Default
    private String timestamp = Instant.now().toString();

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaginationMetaData {
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean last;
    }

    public static <T> PagedResponse<T> fromPage(Page<T> page, String message) {
        PaginationMetaData meta = PaginationMetaData.builder()
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();

        return PagedResponse.<T>builder()
                .success(true)
                .message(message)
                .data(page.getContent())
                .pagination(meta)
                .timestamp(Instant.now().toString())
                .build();
    }
}
