package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "contacts")
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstname;
    private String lastname;
    private String contactEmail;
    private String address;
    private String city;
    private String state;
    private String phoneNumber;
    private String avatar;
    private String photo;
    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

}

