package com.hhr.backend.dto.product;

import com.hhr.backend.dto.category.CategoryResponseDTO;
import com.hhr.backend.dto.feature.FeatureResponseDTO;
import com.hhr.backend.dto.image.ImageResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Set<String> categoryNames;
    private Set<String> featureNames;
    private Set<String> ImageUrls;
    private Set<Long> relatedProductIds;
    private Boolean active;

}
