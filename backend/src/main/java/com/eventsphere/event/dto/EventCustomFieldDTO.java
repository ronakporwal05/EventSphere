package com.eventsphere.event.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventCustomFieldDTO {
    private String id;

    @NotBlank(message = "Field name is required")
    private String fieldName;

    @NotBlank(message = "Field label is required")
    private String fieldLabel;

    @Builder.Default
    private String fieldType = "TEXT";

    private boolean required;
    private String optionsJson;
    private int displayOrder;
}
