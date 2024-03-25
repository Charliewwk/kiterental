package com.hhr.backend.controller;

import com.hhr.backend.entity.Product;
import com.hhr.backend.entity.Category;
import com.hhr.backend.entity.Feature;
import com.hhr.backend.entity.Image;

import com.hhr.backend.dto.product.ProductRequestDTO;
import com.hhr.backend.dto.product.ProductResponseDTO;
import com.hhr.backend.exception.InternalServerException;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.service.category.CategoryService;
import com.hhr.backend.service.feature.FeatureService;
import com.hhr.backend.service.product.ProductService;
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

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private FeatureService featureService;
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
        Pageable pageable;
        if (sortBy != null) {
            Sort.Direction direction = sortOrder.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        } else {
            pageable = PageRequest.of(page, size);
        }

        Page<Product> productPage = random ? productService.findRandom(pageable) : productService.findAll(pageable);
        Page<ProductResponseDTO> responsePage = productPage.map(product -> {
            ProductResponseDTO responseDTO = modelMapper.map(product, ProductResponseDTO.class);
            responseDTO.setCategoryNames(product.getCategories().stream().map(Category::getName).collect(Collectors.toSet()));
            responseDTO.setFeatureNames(product.getFeatures().stream().map(Feature::getName).collect(Collectors.toSet()));
            responseDTO.setImageUrls(product.getImages().stream().map(Image::getName).collect(Collectors.toSet()));
            responseDTO.setRelatedProductIds(product.getRelatedProducts().stream().map(Product::getId).collect(Collectors.toSet()));
            responseDTO.setActive(product.getActive());
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
                    responseDTO.setImageUrls(product.getImages().stream().map(Image::getName).collect(Collectors.toSet()));
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
                    responseDTO.setImageUrls(product.getImages().stream().map(Image::getName).collect(Collectors.toSet()));
                    return responseDTO;
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createProduct(@RequestBody ProductRequestDTO requestDTO) {
        try {
            if (productService.existsByName(requestDTO.getName())) {
                throw new ResourceAlreadyExistsException("Product " + requestDTO.getName() + " already exists.");
            }

            Product product = modelMapper.map(requestDTO, Product.class);

/*
            Set<Category> categories = new HashSet<>();
            for (String categoryName : requestDTO.getCategories()) {
                Category category = categoryService.findByName(categoryName);
                if (category == null) {
                    category = new Category();
                    category.setName(categoryName);
                    categoryService.create(category);
                }
                categories.add(category);
            }
            product.setCategories(categories);
*/

/*
            Set<Feature> features = new HashSet<>();
            for (String featureName : requestDTO.getFeatures()) {
                Feature feature = featureService.findByName(featureName);
                if (feature == null) {
                    feature = new Feature();
                    feature.setName(featureName);
                    featureService.create(feature);
                }
                features.add(feature);
            }
            product.setFeatures(features);
*/

/*
            Set<Image> images = new HashSet<>();
            for (String imageUrl : requestDTO.getImages()) {
                Image image = imageService.findByUrl(imageUrl);
                if (image == null) {
                    image = new Image();
                    image.setUrl(imageUrl);
                    imageService.create(image);
                }
                images.add(image);
            }
            product.setImages(images);
*/

            Set<Product> relatedProducts = new HashSet<>();
            for (Long relatedProductId : requestDTO.getRelated()) {
                Optional<Product> relatedProduct = productService.findById(relatedProductId);
                relatedProduct.ifPresent(relatedProducts::add);
            }
            product.setRelatedProducts(relatedProducts);

            Product createdProduct = productService.create(product);

            ProductResponseDTO responseDTO = modelMapper.map(createdProduct, ProductResponseDTO.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (ResourceAlreadyExistsException e) {
            throw new ResourceAlreadyExistsException("Product " + requestDTO.getName() + " already exists.");
        } catch (Exception e) {
            throw new InternalServerException("Error creating the product.", e);
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
