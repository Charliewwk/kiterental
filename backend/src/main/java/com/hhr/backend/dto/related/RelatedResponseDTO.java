package com.hhr.backend.dto.related;

import com.hhr.backend.dto.image.ImageResponseDTO;
import lombok.Data;

import java.util.Set;

@Data
public class RelatedResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Boolean active;
    private Set<ImageResponseDTO> images;

}
