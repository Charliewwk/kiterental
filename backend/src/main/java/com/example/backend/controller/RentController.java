package com.example.backend.controller;

import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.dto.RentRequestDTO;
import com.example.backend.dto.RentResponseDTO;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.service.RentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rents")
public class RentController {

    private final RentService rentService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public RentController(RentService rentService, UserRepository userRepository, ProductRepository productRepository) {
        this.rentService = rentService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @PostMapping
    public ResponseEntity<?> createRent(@RequestBody RentRequestDTO rentRequestDTO) {

        if (rentRequestDTO.getStartDate().isAfter(rentRequestDTO.getEndDate())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("End date debe ser posterior o igual a Start Date");
        }
        Optional<User> user = userRepository.findById(rentRequestDTO.getUserId());
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario inexistente");
        }
        Optional<Product> product = productRepository.findById(rentRequestDTO.getProductId());
        if(product.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Producto inexistente");
        }

        RentResponseDTO createdRent = rentService.createRent(rentRequestDTO, user.orElse(null), product.orElse(null));
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRent);

    }

    @GetMapping
    public ResponseEntity<List<RentResponseDTO>> getRents(){
        return ResponseEntity.ok(rentService.getAllRents());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RentResponseDTO>> getRentsByUserId(@PathVariable Long userId){

        Optional<User> user = userRepository.findById(userId);
        return ResponseEntity.ok(rentService.getAllRentsByUser(user.orElse(null)));
    }

}
