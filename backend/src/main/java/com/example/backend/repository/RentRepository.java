package com.example.backend.repository;

import com.example.backend.entity.Rent;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentRepository extends JpaRepository<Rent, Long> {
    List<Rent> findByUser(User user);
    List<Rent> findByUserId(Long userId);
    List<Rent> findByProductId(Long productId);
}
