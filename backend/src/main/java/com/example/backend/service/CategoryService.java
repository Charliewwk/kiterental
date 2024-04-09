package com.example.backend.service;

import com.example.backend.repository.CategoryRepository;
import com.example.backend.dto.CategoryResponseDTO;
import com.example.backend.entity.Category;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public CategoryService(CategoryRepository categoryRepository, ModelMapper modelMapper) {
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
    }

    public List<CategoryResponseDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(product -> modelMapper.map(product, CategoryResponseDTO.class))
                .collect(Collectors.toList());
    }
}
