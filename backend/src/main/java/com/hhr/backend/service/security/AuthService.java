package com.hhr.backend.service.security;

import com.hhr.backend.dto.user.AuthRequestDTO;
import com.hhr.backend.dto.user.AuthResponseDTO;
import com.hhr.backend.entity.Contact;
import com.hhr.backend.entity.User;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.repository.UserRepository;
import com.hhr.backend.service.EmailService;
import com.hhr.backend.service.user.UserService;
import jakarta.transaction.Transactional;
import org.apache.log4j.Logger;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = Logger.getLogger(UserService.class);

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final JWTUtils jwtUtils;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final EmailService emailService;
    @Autowired
    private final ModelMapper modelMapper;


    public AuthService(UserRepository userRepository, JWTUtils jwtUtils, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, EmailService emailService, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public AuthResponseDTO signUp(AuthRequestDTO registrationRequest){

        logger.info("signUp method: Getting started.");
        Optional<User> existingUser = userRepository.findByUsername(registrationRequest.getUsername());
        if (existingUser.isPresent()) {
            logger.info("signUp method: " + registrationRequest.getUsername() + " is already registered.");
            throw new ResourceAlreadyExistsException(registrationRequest.getUsername() + " is already registered.");
        }
        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        if (registrationRequest.getRole() != null) {
            user.setRole(registrationRequest.getRole().toUpperCase());
        } else {
            logger.info("signUp method: USER role was assigned by default.");
            user.setRole("USER");
        }
        user.setActive(true);
        Contact contact = Contact.builder()
                .user(user)
                .contactEmail(registrationRequest.getUsername())
                .build();
        user.setContact(contact);

        User userResult = userRepository.save(user);

        if (userResult.getId() != null && userResult.getId() > 0){
            emailService.sendWelcomeEmail(registrationRequest.getName(), registrationRequest.getUsername(), "http://localhost:8080/signin");
        }
        logger.info("signUp method: Finishing.");
        return modelMapper.map(userResult, AuthResponseDTO.class);

    }

    public AuthResponseDTO signIn(AuthRequestDTO signInRequest){

        AuthResponseDTO response = new AuthResponseDTO();
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword()));
            var user = userRepository.findByUsername(signInRequest.getUsername()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(),user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(signInRequest.getUsername());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hs");
            response.setMessage("Successfully Sign In");
        }catch (Exception e){
            response.setStatusCode(401);
            response.setError(e.getMessage());
        }
        return response;

    }

    public AuthResponseDTO refreshToken(AuthRequestDTO refreshTokenRegister){
        AuthResponseDTO response = new AuthResponseDTO();
        String userEmail = jwtUtils.extractUsername(refreshTokenRegister.getToken());
        User users = userRepository.findByUsername(userEmail).orElseThrow();
        response.setStatusCode(500);
        if(jwtUtils.isTokenValid(refreshTokenRegister.getToken(), users)){
            var jwt = jwtUtils.generateToken(users);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshTokenRegister.getToken());
            response.setRole(refreshTokenRegister.getRole());
            response.setExpirationTime("24Hs");
            response.setMessage("Successfully Refreshed Token");
        }
        return response;
    }
}
