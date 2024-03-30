package com.hhr.backend.dto.category;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CategoryResponseDTO {

    private Long id;
    private String name;
    private Boolean active;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private Long createdByUserId;
    private Long updatedByUserId;

}
