package com.example.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class RentRequestDTO {
    private Long userId;
    private Long productId;
    private LocalDate rentDate;
    private LocalDate startDate;
    private LocalDate endDate;

}
