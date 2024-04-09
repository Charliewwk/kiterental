package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RentResponseDTO {
    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private Double totalPrice;
    private LocalDate rentDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdDate;
    private String status;
}

