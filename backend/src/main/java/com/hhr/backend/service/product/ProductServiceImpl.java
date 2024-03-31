package com.hhr.backend.service.product;

import com.hhr.backend.dto.product.ProductRequestDTO;
import com.hhr.backend.dto.product.ProductResponseDTO;
import com.hhr.backend.entity.Category;
import com.hhr.backend.entity.Feature;
import com.hhr.backend.entity.Image;
import com.hhr.backend.entity.Product;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.CategoryRepository;
import com.hhr.backend.repository.FeatureRepository;
import com.hhr.backend.repository.ImageRepository;
import com.hhr.backend.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FeatureRepository featureRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public Product create(Product entity) throws ResourceAlreadyExistsException {
        return null;
    }

    @Override
    @Transactional
    public ProductResponseDTO createFull(ProductRequestDTO requestDTO) throws ResourceAlreadyExistsException {
        logger.info("createFull method: starting...");
        logger.info("createFull method: if productRepository.existsByName");
        if (productRepository.existsByName(requestDTO.getName())) {
            logger.info("createFull method: " + requestDTO.getName() + " already exists");
            throw new ResourceAlreadyExistsException(requestDTO.getName() + " already exists.");
        }
        logger.info("createFull method: mapProductRequestDTOToProduct(requestDTO)");
        Product product = mapProductRequestDTOToProduct(requestDTO);
        logger.info("createFull method: productRepository.save(product)");
        Product savedProduct = productRepository.save(product);
        logger.info("createFull method: return ProductResponseDTO");
        return modelMapper.map(savedProduct, ProductResponseDTO.class);

    }

    private Product mapProductRequestDTOToProduct(ProductRequestDTO requestDTO) {

        Product product = new Product();
        product.setName(requestDTO.getName());
        product.setDescription(requestDTO.getDescription());
        product.setPrice(requestDTO.getPrice());
        product.setActive(requestDTO.getActive());

        if (requestDTO.getCategories() != null) {
            Set<Category> categories = requestDTO.getCategories().stream()
                    .map(categoryRequestDTO -> {
                        return categoryRepository.findByName(categoryRequestDTO.getName())
                                .orElseGet(() -> {
                                    Category newCategory = new Category();
                                    newCategory.setName(categoryRequestDTO.getName());
                                    newCategory.setActive(true);
                                    return categoryRepository.save(newCategory);
                                });
                    })
                    .collect(Collectors.toSet());
            product.setCategories(categories);
        }

        if (requestDTO.getFeatures() != null) {
            Set<Feature> features = requestDTO.getFeatures().stream()
                    .map(featureRequestDTO -> {
                        return featureRepository.findByName(featureRequestDTO.getName())
                                .orElseGet(() -> {
                                    Feature newFeature = new Feature();
                                    newFeature.setName(featureRequestDTO.getName());
                                    newFeature.setActive(true);
                                    return featureRepository.save(newFeature);
                                });
                    })
                    .collect(Collectors.toSet());
            product.setFeatures(features);
        }

        if (requestDTO.getImages() != null) {
            Set<Image> images = requestDTO.getImages().stream()
                    .map(imageRequestDTO -> {
                        return imageRepository.findByName(imageRequestDTO.getName())
                                .orElseGet(() -> {
                                    Image newImage = new Image();
                                    newImage.setName(imageRequestDTO.getName());
                                    newImage.setActive(true);
                                    return imageRepository.save(newImage);
                                });
                    })
                    .collect(Collectors.toSet());
            product.setImages(images);
        }

        return product;

    }

    @Override
    public Product update(Long aLong, Product entity) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        return null;
    }

    @Override
    public void delete(Long aLong) throws ResourceNotFoundException {

    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return null;
    }

    @Override
    public Page<Product> findRandom(Pageable pageable) {
        return null;
    }

    @Override
    public Optional<Product> findById(Long aLong) {
        return Optional.empty();
    }

    @Override
    public Optional<Product> findByName(String name) {
        return Optional.empty();
    }

    @Override
    public boolean existsByName(String name) {
        return false;
    }

}
