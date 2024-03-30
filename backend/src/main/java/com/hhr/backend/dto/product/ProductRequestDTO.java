package com.hhr.backend.dto.product;

import com.hhr.backend.dto.category.CategoryRequestDTO;
import com.hhr.backend.dto.feature.FeatureRequestDTO;
import com.hhr.backend.dto.image.ImageRequestDTO;
import com.hhr.backend.dto.related.RelatedRequestDTO;

import lombok.Data;
import java.util.List;

@Data
public class ProductRequestDTO {

    private String name;
    private String description;
    private Double price;
    private List<CategoryRequestDTO> categories;
    private List<FeatureRequestDTO> features;
    private List<ImageRequestDTO> images;
    private List<RelatedRequestDTO> related;
    private Boolean active;

}
