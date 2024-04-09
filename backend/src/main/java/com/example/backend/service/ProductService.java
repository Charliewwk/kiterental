package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ImageRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.RentRepository;
import com.example.backend.entity.Category;


import com.example.backend.dto.ProductRequestDTO;
import com.example.backend.dto.ProductResponseDTO;
//import com.example.rr.dto.ProductWithCategoriesDTO;
import com.example.backend.entity.Product;
import com.example.backend.entity.Rent;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final RentRepository rentRepository;
    private final ImageRepository imagesRepository;
    private final ModelMapper modelMapper;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, RentRepository rentRepository, ImageRepository imagesRepository, ModelMapper modelMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.rentRepository = rentRepository;
        this.imagesRepository = imagesRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO) {
        Product product = modelMapper.map(productRequestDTO, Product.class);
        product.setCreatedDate(LocalDateTime.now());
        product.setUpdatedDate(LocalDateTime.now());
        product.setActive(true);

        // Asignar la categoría al producto
        Set<Category> categoriesList = new LinkedHashSet<>();
        categoriesList.add(this.createCategoryIfNotExist(productRequestDTO.getCategory()));
        product.setCategories(categoriesList);

        Product savedProduct = productRepository.save(product);
        return modelMapper.map(savedProduct, ProductResponseDTO.class);
    }

    @Transactional
    public ProductResponseDTO updateProduct(Long productId, ProductRequestDTO productRequestDTO) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            modelMapper.map(productRequestDTO, product);
            product.setUpdatedDate(LocalDateTime.now());
            product.setActive(true);

            // Asignar la categoría al producto
            Set<Category> categoriesList = new LinkedHashSet<>();
            categoriesList.add(this.createCategoryIfNotExist(productRequestDTO.getCategory()));
            product.setCategories(categoriesList);

            Product updatedProduct = productRepository.save(product);
            return modelMapper.map(updatedProduct, ProductResponseDTO.class);
        } else {
            // Tengo que agregar manejo de excepción
            return null;
        }
    }

    @Transactional
    public boolean deleteProduct(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            List<Rent> listRents = rentRepository.findByProductId(productId);
            if (!listRents.isEmpty()) {
                //en caso de que el usuario tenga rentas asociadas, primero elimina las rentas y luego el usuario
                for (Rent rent : listRents){
                    rentRepository.delete(rent);
                }
            }
            imagesRepository.deleteByProductId(productId);
            productRepository.deleteById(productId);
            return true;
        } else {
            return false;
        }
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        return (product != null) ? modelMapper.map(product, ProductResponseDTO.class) : null;
    }

    @Transactional
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    public List<ProductResponseDTO> getAllProductsWithCategories() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::mapToProductWithCategoriesDTO)
                .collect(Collectors.toList());
    }

    public ProductResponseDTO getProductWithCategories(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            return mapToProductWithCategoriesDTO(product);
        } else {
            return null;
        }
    }

    /*private ProductResponseDTO mapToProductWithCategoriesDTO(Product product) {
        ProductResponseDTO dto = modelMapper.map(product, ProductResponseDTO.class);
    //    List<String> categoryNames = product.getCategories().stream()
      //          .map(Category::getName)
        //        .collect(Collectors.toList());
        Set<Category> categoryNames = new HashSet<>();
        categoryNames = product.getCategories();
        dto.setCategories(categoryNames);
        return dto;
    }*/

    private ProductResponseDTO mapToProductWithCategoriesDTO(Product product) {
        ProductResponseDTO dto = modelMapper.map(product, ProductResponseDTO.class);
        Set<Category> categories = product.getCategories();
        dto.setCategories(categories); // Asigna directamente el conjunto de categorías al DTO
        return dto;
    }

    public List<ProductResponseDTO> getProductsByCategory(Category category) {
        List<Product> products = productRepository.findByCategories(category);
        return products.stream()
                .map(this::mapToProductWithCategoriesDTO)
                .collect(Collectors.toList());
    }

    private Category createCategoryIfNotExist(String categoryName){
        Optional<Category> optionalCategory = categoryRepository.findByName(categoryName);
        Category category;
        if (optionalCategory.isEmpty()) {
            category = new Category();
            category.setName(categoryName);
            category.setCreatedDate(LocalDateTime.now());
            category.setUpdatedDate(LocalDateTime.now());
            category.setActive(true);
            categoryRepository.save(category);
        }else{
            category = optionalCategory.get();
        }
        return category;
    }
}
