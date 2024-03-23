package com.hhr.backend.dto.product;

import lombok.Data;

@Data
public class ProductRequestDTO {

    private Long id;
    private String name;
    private Double price;

}
