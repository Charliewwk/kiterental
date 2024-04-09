package com.example.backend.dto;

import com.example.backend.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Set<Category> categories;
    private Double price;
    private Set<Long> featureIds;
    private Set<Long> relatedProductIds;
    private Boolean active;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private String imageUrl;
}