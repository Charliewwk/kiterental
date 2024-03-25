package com.hhr.backend.service.product;

import com.hhr.backend.entity.Product;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
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

    @Transactional
    @Override
    public Product create(Product entity) throws ResourceAlreadyExistsException {
        logger.info("createProduct method: Getting started.");
        if (productRepository.existsByName(entity.getName())) {
            logger.info("createProduct method: Product with name " + entity.getName() + " already exists.");
            throw new ResourceAlreadyExistsException("Product with name " + entity.getName() + " already exists.");
        }
        logger.info("createProduct method: Successful product registration");
        return productRepository.save(entity);
    }

    @Transactional
    @Override
    public Product update(Long id, Product entity) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        logger.info("updateProduct method: Getting started.");
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            logger.info("updateProduct method: Product with ID " + id + " not found.");
            throw new ResourceNotFoundException("Product with ID " + id + " not found.");
        }
        Product existingProduct = optionalProduct.get();
        if (!existingProduct.getName().equals(entity.getName()) && productRepository.existsByName(entity.getName())) {
            logger.info("updateProduct method: Product with name " + entity.getName() + " already exists.");
            throw new ResourceAlreadyExistsException("Product with name " + entity.getName() + " already exists.");
        }
        logger.info("updateProduct method: Successful product modification");
        return productRepository.save(existingProduct);
    }

    @Transactional
    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        logger.info("deleteProduct method: Getting started.");
        if (!productRepository.existsById(id)) {
            logger.info("deleteProduct method: Product with ID " + id + " not found.");
            throw new ResourceNotFoundException("Product with ID " + id + " not found.");
        }
        logger.info("deleteProduct method: Successful product removal");
        productRepository.deleteById(id);
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        logger.info("findAll method: Executed.");
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> findRandom(Pageable pageable) {
        logger.info("findRandom method: Getting started.");
        List<Product> allProducts = productRepository.findAll();
        Collections.shuffle(allProducts);
        int pageSize = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int start = pageSize * pageNumber;
        int end = Math.min(start + pageSize, allProducts.size());
        List<Product> randomProducts = allProducts.subList(start, end);
        logger.info("findRandom method: Getting Finalized.");
        return new PageImpl<>(randomProducts, pageable, allProducts.size());
    }

    @Override
    public Optional<Product> findById(Long id) {
        logger.info("findById method: Executed.");
        return productRepository.findById(id);
    }

    @Override
    public Optional<Product> findByName(String name) {
        logger.info("findByName method: Executed.");
        return productRepository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        logger.info("existsByName method: Executed.");
        return productRepository.existsByName(name);
    }
}
