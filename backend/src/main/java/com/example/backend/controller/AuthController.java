package com.example.backend.controller;

import com.example.backend.dto.AuthRequestDTO;
import com.example.backend.dto.AuthResponseDTO;
import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDTO> signUp(@RequestBody AuthRequestDTO signUpRequest){
        AuthResponseDTO createdUser = authService.signUp(signUpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponseDTO> signiIn(@RequestBody AuthRequestDTO signInRequest){

        AuthResponseDTO signInResponse = authService.signIn(signInRequest);
        if (signInResponse.getStatusCode() == 200) {
            return ResponseEntity.ok(signInResponse);
        } else {
            return ResponseEntity.status(signInResponse.getStatusCode()).body(signInResponse);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refreshToken(@RequestBody AuthRequestDTO refreshTokenRequest){
        AuthResponseDTO refreshToken = authService.refreshToken(refreshTokenRequest);
        if (refreshToken.getStatusCode() == 200) {
            return ResponseEntity.ok(refreshToken);
        } else {
            return ResponseEntity.status(refreshToken.getStatusCode()).body(refreshToken);
        }

    }
}

