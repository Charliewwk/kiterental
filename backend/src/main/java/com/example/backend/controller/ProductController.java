package com.example.backend.controller;

import com.example.backend.repository.CategoryRepository;
import com.example.backend.dto.ProductRequestDTO;
import com.example.backend.dto.ProductResponseDTO;
import com.example.backend.entity.Category;
import com.example.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;

    public ProductController(ProductService productService, CategoryRepository categoryRepository) {
        this.productService = productService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProductsWithCategories(@RequestParam(value = "category", defaultValue = "all") String category) {

        List<ProductResponseDTO> products = new ArrayList<>();
        if (category.equalsIgnoreCase("all")){
            products = productService.getAllProductsWithCategories();
        } else {
            Optional<Category> categoryObj = categoryRepository.findByName(category);
            if(categoryObj.isPresent()) {
                products = productService.getProductsByCategory(categoryObj.orElse(null));
            }
        }

        return ResponseEntity.ok(products);
}

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequestDTO productRequestDTO) {
        boolean productExists = productService.existsByName(productRequestDTO.getName());
        if (productExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un ítem con el mismo nombre.");
        } else {
            ProductResponseDTO createdProduct = productService.createProduct(productRequestDTO);
            if(productRequestDTO.getName() == null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Se necesita especificar un nombre.");
}
            else {
                return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        }}
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable Long productId, @RequestBody ProductRequestDTO productRequestDTO) {
        ProductResponseDTO updatedProduct = productService.updateProduct(productId, productRequestDTO);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, Boolean>> deleteProduct(@PathVariable Long productId) {
        boolean deleted = productService.deleteProduct(productId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", deleted);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductWithCategories(@PathVariable Long productId) {
        ProductResponseDTO productWithCategories = productService.getProductWithCategories(productId);
        if (productWithCategories != null) {
            return ResponseEntity.ok(productWithCategories);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}

