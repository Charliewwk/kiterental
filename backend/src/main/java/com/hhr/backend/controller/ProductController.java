package com.hhr.backend.controller;

import com.hhr.backend.dto.category.CategoryResponseDTO;
import com.hhr.backend.dto.feature.FeatureResponseDTO;
import com.hhr.backend.entity.Product;

import com.hhr.backend.dto.product.ProductRequestDTO;
import com.hhr.backend.dto.product.ProductResponseDTO;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.service.product.ProductService;
import org.apache.log4j.Logger;
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

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    private static final Logger logger = Logger.getLogger(ProductController.class);
    @Autowired
    private ProductService productService;
    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder,
            @RequestParam(required = false) boolean random
    ) {
        logger.info("Getting started");
        Pageable pageable;
        if (sortBy != null) {
            logger.info("Setting sort order");
            Sort.Direction direction = sortOrder.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        } else {
            logger.info("Setting default sort order");
            pageable = PageRequest.of(page, size);
        }

        logger.info("Conditional that sets the productPage variable to random or not");
        Page<Product> productPage = random ? productService.findRandom(pageable) : productService.findAll(pageable);
        logger.info("//////////////////////////////////////");
        logger.info(productPage);
        logger.info("//////////////////////////////////////");
        Page<ProductResponseDTO> responsePage = productPage.map(product -> {
            logger.info("Product mapping");
            ProductResponseDTO responseDTO = modelMapper.map(product, ProductResponseDTO.class);
            logger.info("Categories mapping");
            Set<CategoryResponseDTO> categoryDTOs = product.getCategories().stream()
                    .map(category -> modelMapper.map(category, CategoryResponseDTO.class))
                    .collect(Collectors.toSet());
            logger.info("setting category DTO");
            responseDTO.setCategories(categoryDTOs);
            logger.info("Features mapping");
            Set<FeatureResponseDTO> featureDTOs = product.getFeatures().stream()
                    .map(feature -> modelMapper.map(feature, FeatureResponseDTO.class))
                    .collect(Collectors.toSet());
            logger.info("setting feature DTO");
            responseDTO.setFeatures(featureDTOs);

/*            logger.info("Images mapping");
            Set<ImageResponseDTO> imageDTOs = product.getImages().stream()
                    .map(image -> modelMapper.map(image, ImageResponseDTO.class))
                    .collect(Collectors.toSet());
            logger.info("setting image DTO");*/
/*
            responseDTO.setImages(imageDTOs);
*/

            return responseDTO;
        });

        return ResponseEntity.ok(responsePage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(product -> {
                    ProductResponseDTO responseDTO = modelMapper.map(product, ProductResponseDTO.class);

/*
                    Set<CategoryResponseDTO> categoryDTOs = product.getCategories().stream()
                            .map(category -> modelMapper.map(category, CategoryResponseDTO.class))
                            .collect(Collectors.toSet());
                    responseDTO.setCategories(categoryDTOs);
                    Set<FeatureResponseDTO> featureDTOs = product.getFeatures().stream()
                            .map(feature -> modelMapper.map(feature, FeatureResponseDTO.class))
                            .collect(Collectors.toSet());
                    responseDTO.setFeatures(featureDTOs);
*/

                    return ResponseEntity.ok(responseDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<ProductResponseDTO> getProductByName(@RequestParam String name) {
/*
        return productService.findByName(name)
*/
/*
                .map(product -> {
                    ProductResponseDTO responseDTO = modelMapper.map(product, ProductResponseDTO.class);
                    Set<CategoryResponseDTO> categoryDTOs = product.getCategories().stream()
                            .map(category -> modelMapper.map(category, CategoryResponseDTO.class))
                            .collect(Collectors.toSet());
                    responseDTO.setCategories(categoryDTOs);
                    Set<FeatureResponseDTO> featureDTOs = product.getFeatures().stream()
                            .map(feature -> modelMapper.map(feature, FeatureResponseDTO.class))
                            .collect(Collectors.toSet());
                    responseDTO.setFeatures(featureDTOs);
                    return responseDTO;
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
*/
        return null;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createProduct(@RequestBody ProductRequestDTO requestDTO) {
        return null;
    }

    @PostMapping("/createfull")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createProductFull(@RequestBody ProductRequestDTO requestDTO) {
        logger.info("createProductFull method: starting...");
        try {
            logger.info("createProductFull method: productService.createProduct(requestDTO)");
            ProductResponseDTO createdFull = productService.createFull(requestDTO);
            logger.info("createProductFull method: Response CREATED");
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFull);
        } catch (ResourceAlreadyExistsException e) {
            logger.info("createProductFull method: Response CONFLICT");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            logger.info("createProductFull method: Response INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating the product.");
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
