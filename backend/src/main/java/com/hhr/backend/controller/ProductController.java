package com.hhr.backend.controller;

import com.hhr.backend.entity.Product;
import com.hhr.backend.entity.Category;
import com.hhr.backend.entity.Feature;
import com.hhr.backend.entity.Image;

import com.hhr.backend.dto.product.ProductRequestDTO;
import com.hhr.backend.dto.product.ProductResponseDTO;
import com.hhr.backend.service.product.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productService.findAll(pageable);

        Page<ProductResponseDTO> responsePage = productPage.map(product -> {
            ProductResponseDTO responseDTO = modelMapper.map(product, ProductResponseDTO.class);
            responseDTO.setCategoryNames(product.getCategories().stream().map(Category::getName).collect(Collectors.toSet()));
            responseDTO.setFeatureNames(product.getFeatures().stream().map(Feature::getName).collect(Collectors.toSet()));
            responseDTO.setImageUrls(product.getImages().stream().map(Image::getUrl).collect(Collectors.toSet()));
            return responseDTO;
        });

        return ResponseEntity.ok(responsePage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(product -> {
                    ProductResponseDTO responseDTO = modelMapper.map(product, ProductResponseDTO.class);
                    responseDTO.setCategoryNames(product.getCategories().stream().map(Category::getName).collect(Collectors.toSet()));
                    responseDTO.setFeatureNames(product.getFeatures().stream().map(Feature::getName).collect(Collectors.toSet()));
                    responseDTO.setImageUrls(product.getImages().stream().map(Image::getUrl).collect(Collectors.toSet()));
                    return ResponseEntity.ok(responseDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<ProductResponseDTO> getProductByName(@RequestParam String name) {
        return productService.findByName(name)
                .map(product -> {
                    ProductResponseDTO responseDTO = modelMapper.map(product, ProductResponseDTO.class);
                    responseDTO.setCategoryNames(product.getCategories().stream().map(Category::getName).collect(Collectors.toSet()));
                    responseDTO.setFeatureNames(product.getFeatures().stream().map(Feature::getName).collect(Collectors.toSet()));
                    responseDTO.setImageUrls(product.getImages().stream().map(Image::getUrl).collect(Collectors.toSet()));
                    return responseDTO;
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody ProductRequestDTO requestDTO) {
        Product product = modelMapper.map(requestDTO, Product.class);
        try {
            Product createdProduct = productService.create(product);
            ProductResponseDTO responseDTO = modelMapper.map(createdProduct, ProductResponseDTO.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product updatedProduct = productService.update(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
