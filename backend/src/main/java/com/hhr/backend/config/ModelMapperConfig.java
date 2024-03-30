package com.hhr.backend.config;

import com.hhr.backend.dto.category.CategoryResponseDTO;
import com.hhr.backend.dto.product.ProductResponseDTO;
import com.hhr.backend.entity.Category;
import com.hhr.backend.entity.Product;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {

        ModelMapper modelMapper = new ModelMapper();

        TypeMap<Product, ProductResponseDTO> productTypeMap = modelMapper.createTypeMap(Product.class, ProductResponseDTO.class);
        productTypeMap.addMapping(src -> src.getCreatedBy().getId(), ProductResponseDTO::setCreatedByUserId);
        productTypeMap.addMapping(src -> src.getUpdatedBy().getId(), ProductResponseDTO::setUpdatedByUserId);

        TypeMap<Category, CategoryResponseDTO> categoryTypeMap = modelMapper.createTypeMap(Category.class, CategoryResponseDTO.class);
        categoryTypeMap.addMapping(src -> src.getCreatedBy().getId(), CategoryResponseDTO::setCreatedByUserId);
        categoryTypeMap.addMapping(src -> src.getUpdatedBy().getId(), CategoryResponseDTO::setUpdatedByUserId);

        return modelMapper;
    }
}
