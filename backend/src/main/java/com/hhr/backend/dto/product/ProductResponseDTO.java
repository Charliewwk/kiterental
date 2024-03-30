package com.hhr.backend.dto.product;

import com.hhr.backend.dto.category.CategoryResponseDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private List<CategoryResponseDTO> categories;
    private Boolean active;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private Long createdByUserId;
    private Long updatedByUserId;

}
