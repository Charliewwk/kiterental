package com.hhr.backend.service.implementation;

import com.hhr.backend.entity.Product;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.ProductRepository;
import com.hhr.backend.service.product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product create(Product entity) throws ResourceAlreadyExistsException {
        if (productRepository.existsByName(entity.getName())) {
            throw new ResourceAlreadyExistsException("Product with name " + entity.getName() + " already exists.");
        }
        return productRepository.save(entity);
    }

    @Override
    public Product update(Long id, Product entity) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            throw new ResourceNotFoundException("Product with ID " + id + " not found.");
        }
        Product existingProduct = optionalProduct.get();
        if (!existingProduct.getName().equals(entity.getName()) && productRepository.existsByName(entity.getName())) {
            throw new ResourceAlreadyExistsException("Product with name " + entity.getName() + " already exists.");
        }
        // Update existingProduct fields with entity fields
        // For example: existingProduct.setName(entity.getName());
        return productRepository.save(existingProduct);
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product with ID " + id + " not found.");
        }
        productRepository.deleteById(id);
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> findRandom(Pageable pageable) {
        List<Product> allProducts = productRepository.findAll();
        Collections.shuffle(allProducts);
        int pageSize = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int start = pageSize * pageNumber;
        int end = Math.min(start + pageSize, allProducts.size());
        List<Product> randomProducts = allProducts.subList(start, end);
        return new PageImpl<>(randomProducts, pageable, allProducts.size());
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Optional<Product> findByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }
}
