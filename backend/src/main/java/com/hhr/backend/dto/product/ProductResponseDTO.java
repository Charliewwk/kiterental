package com.hhr.backend.dto.product;

import com.hhr.backend.dto.category.CategoryResponseDTO;
import com.hhr.backend.dto.feature.FeatureResponseDTO;
import com.hhr.backend.dto.image.ImageResponseDTO;
import com.hhr.backend.dto.related.RelatedResponseDTO;
import lombok.Data;
import java.util.Set;

@Data
public class ProductResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Set<CategoryResponseDTO> categories;
    private Set<FeatureResponseDTO> features;
    private Set<ImageResponseDTO> images;
    private Set<RelatedResponseDTO> related;
    private Boolean active;

}
