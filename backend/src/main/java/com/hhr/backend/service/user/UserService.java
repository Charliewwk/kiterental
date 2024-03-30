package com.hhr.backend.service.user;

import com.hhr.backend.dto.user.UserRequestDTO;
import com.hhr.backend.dto.user.UserResponseDTO;
import com.hhr.backend.entity.User;
import com.hhr.backend.entity.Contact;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.UserRepository;
import org.apache.log4j.Logger;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = Logger.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {

        logger.info("createUser method: Getting started.");
        Optional<User> existingUser = userRepository.findByUsername(userRequestDTO.getUsername());
            if (existingUser.isPresent()) {
                logger.info("createUser method: " + userRequestDTO.getUsername() + " is already registered.");
                throw new ResourceAlreadyExistsException(userRequestDTO.getUsername() + " is already registered.");
        }
        User user = modelMapper.map(userRequestDTO, User.class);
        user.setCreatedDate(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        if (userRequestDTO.getRole() != null) {
            user.setRole(userRequestDTO.getRole().toUpperCase());
        } else {
            logger.info("createUser method: USER role was assigned by default.");
            user.setRole("USER");
        }
        user.setActive(true);
        Contact contact = Contact.builder()
                .user(user)
                .contactEmail(userRequestDTO.getUsername())
                .build();
        user.setContact(contact);

        User savedUser = userRepository.save(user);
        logger.info("createUser method: Finishing.");
        return modelMapper.map(savedUser, UserResponseDTO.class);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long UserId) {
        User user = userRepository.findById(UserId).orElse(null);
        return (user != null) ? modelMapper.map(user, UserResponseDTO.class) : null;
    }

    @Transactional
    public UserResponseDTO updateUser(Long userId, UserRequestDTO userRequestDTO) {

        logger.info("updateUser method: Getting started.");
        Optional<User> existingUserOptional = userRepository.findById(userId);
        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();
            ModelMapper modelMapper = new ModelMapper();
            modelMapper.getConfiguration().setSkipNullEnabled(true);
            modelMapper.map(userRequestDTO, existingUser);
            if (!passwordEncoder.matches(userRequestDTO.getPassword(), existingUser.getPassword())) {
                existingUser.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
            }
            existingUser.setUpdatedDate(LocalDateTime.now());
            User updatedUser = userRepository.save(existingUser);
            logger.info("updateUser method: Finishing.");
            return modelMapper.map(updatedUser, UserResponseDTO.class);
        } else {
            logger.info("updateUser method: User not found with id: " + userId);
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long UserId) {
        userRepository.deleteById(UserId);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByUsername(email);
        return userOptional.map(user -> modelMapper.map(user, UserResponseDTO.class)).orElse(null);
    }

    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.orElse(null);
    }

}
