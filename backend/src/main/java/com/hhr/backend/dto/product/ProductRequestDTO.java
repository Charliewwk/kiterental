package com.hhr.backend.dto.product;

import com.hhr.backend.dto.category.CategoryRequestDTO;
import com.hhr.backend.dto.feature.FeatureRequestDTO;
import com.hhr.backend.dto.image.ImageRequestDTO;
import com.hhr.backend.dto.related.RelatedRequestDTO;
import lombok.Data;
import java.util.Set;

@Data
public class ProductRequestDTO {

    private String name;
    private String description;
    private Double price;
    private Set<CategoryRequestDTO> categories;
    private Set<FeatureRequestDTO> features;
    private Set<ImageRequestDTO> images;
    private Set<RelatedRequestDTO> related;
    private Boolean active;

}
