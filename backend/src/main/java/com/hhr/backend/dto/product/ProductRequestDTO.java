package com.hhr.backend.dto.product;

import lombok.Data;
import java.util.List;

@Data
public class ProductRequestDTO {

    private Long id;
    private String name;
    private Double price;
    private String description;
    private List<String> categories;
    private List<String> features;
    private List<String> images;
    private List<Long> related;

}
