package com.hhr.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String username;
    private String role;
    private Boolean active;
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
