package com.hhr.backend.controller;

import com.hhr.backend.dto.category.CategoryRequestDTO;
import com.hhr.backend.dto.category.CategoryResponseDTO;
import com.hhr.backend.entity.Category;
import com.hhr.backend.exception.InternalServerException;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.service.category.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<Page<CategoryResponseDTO>> getCategories(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String sortBy,
        @RequestParam(required = false, defaultValue = "asc") String sortOrder,
        @RequestParam(required = false) boolean random
    ) {
        Pageable pageable;
        if (sortBy != null) {
            Sort.Direction direction = sortOrder.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        } else {
            pageable = PageRequest.of(page, size);
        }

        Page<Category> categoryPage = random ? categoryService.findRandom(pageable) : categoryService.findAll(pageable);
        Page<CategoryResponseDTO> responsePage = categoryPage.map(category -> modelMapper.map(category, CategoryResponseDTO.class));

        return ResponseEntity.ok(responsePage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id) {
        return categoryService.findById(id)
                .map(category -> {
                    CategoryResponseDTO responseDTO = modelMapper.map(category, CategoryResponseDTO.class);
                    return ResponseEntity.ok(responseDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<CategoryResponseDTO> getCategoryByName(@RequestParam String name) {
        return categoryService.findByName(name)
                .map(category -> modelMapper.map(category, CategoryResponseDTO.class))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createCategory(@RequestBody CategoryRequestDTO requestDTO) {
        try {
            if (categoryService.existsByName(requestDTO.getName())) {
                throw new ResourceAlreadyExistsException("Category " + requestDTO.getName() + " already exists.");
            }
            Category category = modelMapper.map(requestDTO, Category.class);
            category.setCreatedDate(LocalDateTime.now());
            category.setActive(true);
            Category createCategory = categoryService.create(category);
            CategoryResponseDTO responseDTO = modelMapper.map(createCategory, CategoryResponseDTO.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (ResourceAlreadyExistsException e) {
            throw new ResourceAlreadyExistsException("Category " + requestDTO.getName() + " already exists.");
        } catch (Exception e) {
            throw new InternalServerException("Error creating the category.", e);
        }
    }
}