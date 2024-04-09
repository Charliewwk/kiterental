package com.example.backend.controller;

import com.example.backend.dto.RentDetailDTO;
import com.example.backend.service.RentDetailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rent-details")
public class RentDetailController {

    private final RentDetailService rentDetailService;

    public RentDetailController(RentDetailService rentDetailService) {
        this.rentDetailService = rentDetailService;
    }

    @PostMapping
    public ResponseEntity<RentDetailDTO> createRentDetail(@RequestBody RentDetailDTO rentDetailDTO) {
        RentDetailDTO createdRentDetail = rentDetailService.createRentDetail(rentDetailDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRentDetail);
    }

}
