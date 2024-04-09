package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactResponseDTO {
    private Long id;
    private String email;
    private String role;
    private String firstname;
    private String lastname;
    private String address;
    private String city;
    private String state;
    private String contactEmail;
    private String phoneNumber;
    private String avatar;
    private String photo;

}
