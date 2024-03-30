package com.hhr.backend.dto.image;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ImageResponseDTO {

    private Long id;
    private String name;
    private Boolean active;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private Long createdByUserId;
    private Long updatedByUserId;

    public void setProducts(Object o) {
    }
}
