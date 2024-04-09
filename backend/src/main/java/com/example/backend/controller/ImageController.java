package com.example.backend.controller;

import com.example.backend.repository.ProductRepository;
import com.example.backend.dto.ImageRequestDTO;
import com.example.backend.dto.ImageResponseDTO;
import com.example.backend.entity.Product;
import com.example.backend.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/images")
public class ImageController {

    private final ImageService imageService;
    private final ProductRepository productRepository;

    public ImageController(ImageService imageService, ProductRepository productRepository) {
        this.imageService = imageService;
        this.productRepository = productRepository;
    }

    @PostMapping
    public ResponseEntity<ImageResponseDTO> createImage(@RequestBody ImageRequestDTO imageRequestDTO) {
        ImageResponseDTO createdImage = imageService.createImage(imageRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdImage);
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<ImageResponseDTO> getImage(@PathVariable Long imageId) {
        ImageResponseDTO image = imageService.getImageById(imageId);
        if (image != null) {
            return ResponseEntity.ok(image);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ImageResponseDTO>> getAllImages() {
        List<ImageResponseDTO> images = imageService.getAllImages();
        if (!images.isEmpty()) {
            return ResponseEntity.ok(images);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<List<ImageResponseDTO>> getAllImagesByProduct(@PathVariable Long productId) {

        //Optional<Product> product = productRepository.findById(productId);
        Product p = new Product();
        p.setId(productId);
        List<ImageResponseDTO> images = imageService.getAllImagesByProduct(p);
        if (!images.isEmpty()) {
            return ResponseEntity.ok(images);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

}

