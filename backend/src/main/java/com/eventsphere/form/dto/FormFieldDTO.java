package com.eventsphere.form.dto;

import com.eventsphere.form.entity.FieldType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormFieldDTO {
    private String id;

    @NotBlank(message = "Field name is required")
    private String fieldName;

    @NotBlank(message = "Field label is required")
    private String fieldLabel;

    @NotNull(message = "Field type is required")
    private FieldType fieldType;

    private String placeholder;
    private String helpText;
    private String defaultValue;
    private boolean required;
    private String regexPattern;
    private Integer minLength;
    private Integer maxLength;
    private BigDecimal minValue;
    private BigDecimal maxValue;
    private String conditionalParentFieldId;
    private String conditionalParentValue;
    private int displayOrder;
    private List<FieldOptionDTO> options;
}
