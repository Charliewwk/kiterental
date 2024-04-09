package com.example.backend.service;

import com.example.backend.exception.ResourceAlreadyExistsException;
import com.example.backend.repository.ContactRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.dto.AuthRequestDTO;
import com.example.backend.dto.AuthResponseDTO;
import com.example.backend.entity.Contact;
import com.example.backend.entity.User;
import jakarta.transaction.Transactional;
import org.apache.log4j.Logger;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final ContactRepository contactRepository;
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


    public AuthService(UserRepository userRepository, ContactRepository contactRepository, JWTUtils jwtUtils, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, EmailService emailService, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.contactRepository = contactRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public AuthResponseDTO signUp(AuthRequestDTO registrationRequest){

        logger.info("signUp method: Getting started.");
        Optional<User> existingUser = userRepository.findByEmail(registrationRequest.getEmail());
        if (existingUser.isPresent()) {
            logger.info("signUp method: " + registrationRequest.getEmail() + " is already registered.");
            throw new ResourceAlreadyExistsException(registrationRequest.getEmail() + " is already registered.");
        }
        User user = new User();
        user.setEmail(registrationRequest.getEmail());
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
                .contactEmail(registrationRequest.getEmail())
                .build();
        user.setContact(contact);

        User userResult = userRepository.save(user);

/*        if (userResult.getId() != null && userResult.getId() > 0){
            emailService.sendWelcomeEmail(registrationRequest.getName(), registrationRequest.getEmail(), "http://localhost:8080/signin");
        }*/

        logger.info("signUp method: Finishing.");
        return modelMapper.map(userResult, AuthResponseDTO.class);

    }

    public AuthResponseDTO signIn(AuthRequestDTO signInRequest) {
        AuthResponseDTO response = new AuthResponseDTO();
        try {
            // Autenticar al usuario utilizando su correo electrónico y contraseña
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword())
            );

            // Establecer la autenticación en el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Obtener el usuario basado en el correo electrónico
            User user = userRepository.findByEmail(signInRequest.getEmail()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Generar tokens JWT
            String jwtToken = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            // Configurar la respuesta de autenticación
            response.setStatusCode(200);
            response.setToken(jwtToken);
            response.setRole(user.getRole());
            response.setUsername(user.getUsername());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hs");
            response.setMessage("Inicio de sesión exitoso");
            response.setId(user.getId());
            response.setEmail(user.getEmail());

            // Incluir el objeto User en la respuesta
            //response.setUser(user);
        } catch (Exception e) {
            // Manejar cualquier error durante la autenticación
            response.setStatusCode(401);
            response.setError(e.getMessage());
        }
        return response;
    }

    /*
    public AuthResponseDTO signIn(AuthRequestDTO signInRequest){

        AuthResponseDTO response = new AuthResponseDTO();
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(),signInRequest.getPassword()));
            var user = userRepository.findByEmail(signInRequest.getEmail()).orElseThrow();
            System.out.println("User: " + user);
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(),user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hs");
            response.setMessage("Successfully Sign In");
        }catch (Exception e){
            response.setStatusCode(401);
            response.setError(e.getMessage());
        }
        return response;

    }*/

    public AuthResponseDTO refreshToken(AuthRequestDTO refreshTokenRegister){
        AuthResponseDTO response = new AuthResponseDTO();
        String userEmail = jwtUtils.extractUsername(refreshTokenRegister.getToken());
        User users = userRepository.findByEmail(userEmail).orElseThrow();
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
