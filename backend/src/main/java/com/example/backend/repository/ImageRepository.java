package com.example.backend.repository;

import com.example.backend.entity.Image;
import com.example.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByProduct(Product product);
    void deleteByProductId(Long productId);
}
