package com.example.backend.dto;

import com.example.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponseDTO {

    private Long id;
    private String name;
    private Boolean active;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private User createdBy;
    private User updatedBy;
}
