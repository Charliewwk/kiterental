package com.hhr.backend.controller;

import com.hhr.backend.dto.image.ImageRequestDTO;
import com.hhr.backend.dto.image.ImageResponseDTO;
import com.hhr.backend.entity.Image;
import com.hhr.backend.exception.InternalServerException;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.service.image.ImageService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/images")
public class ImageController {
    @Autowired
    private ImageService imageService;
    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<Page<ImageResponseDTO>> getImages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder,
            @RequestParam(required = false) boolean random
    ) {
        Pageable pageable;
        if (sortBy != null) {
            Sort.Direction direction = sortOrder.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        } else {
            pageable = PageRequest.of(page, size);
        }

        Page<Image> imagePage = random ? imageService.findRandom(pageable) : imageService.findAll(pageable);
        Page<ImageResponseDTO> responsePage = imagePage.map(image -> modelMapper.map(image, ImageResponseDTO.class));

        return ResponseEntity.ok(responsePage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageResponseDTO> getImageById(@PathVariable Long id) {
        return imageService.findById(id)
                .map(image -> {
                    ImageResponseDTO responseDTO = modelMapper.map(image, ImageResponseDTO.class);
                    return ResponseEntity.ok(responseDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<ImageResponseDTO> getImageByName(@RequestParam String name) {
        return imageService.findByName(name)
                .map(image -> modelMapper.map(image, ImageResponseDTO.class))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createImage(@RequestBody ImageRequestDTO requestDTO) {
        try {
            if (imageService.existsByName(requestDTO.getName())) {
                throw new ResourceAlreadyExistsException("Image " + requestDTO.getName() + " already exists.");
            }
            Image image = modelMapper.map(requestDTO, Image.class);
            image.setCreatedDate(LocalDateTime.now());
            image.setActive(true);
            Image createImage = imageService.create(image);
            ImageResponseDTO responseDTO = modelMapper.map(createImage, ImageResponseDTO.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (ResourceAlreadyExistsException e) {
            throw new ResourceAlreadyExistsException("Image " + requestDTO.getName() + " already exists.");
        } catch (Exception e) {
            throw new InternalServerException("Error creating image.", e);
        }
    }

}
