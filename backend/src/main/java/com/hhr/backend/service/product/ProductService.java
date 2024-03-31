package com.hhr.backend.service.product;

import com.hhr.backend.dto.product.ProductRequestDTO;
import com.hhr.backend.dto.product.ProductResponseDTO;
import com.hhr.backend.entity.Product;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.service.GenericService;

public interface ProductService extends GenericService<Product, Long> {
    ProductResponseDTO createFull(ProductRequestDTO requestDTO) throws ResourceAlreadyExistsException;

}
