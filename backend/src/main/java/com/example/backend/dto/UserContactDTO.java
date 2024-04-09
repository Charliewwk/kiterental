package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserContactDTO {
    private Long userId;
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
