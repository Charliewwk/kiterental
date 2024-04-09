package com.example.backend.repository;

import com.example.backend.entity.RentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentDetailRepository extends JpaRepository<RentDetail, Long> {
}

