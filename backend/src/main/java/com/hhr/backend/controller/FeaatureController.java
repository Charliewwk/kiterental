package com.hhr.backend.controller;

import com.hhr.backend.dto.feature.FeatureRequestDTO;
import com.hhr.backend.dto.feature.FeatureResponseDTO;
import com.hhr.backend.entity.Feature;
import com.hhr.backend.exception.InternalServerException;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.service.feature.FeatureService;
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
@RequestMapping("/features")
public class FeaatureController {

    @Autowired
    private FeatureService featureService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<Page<FeatureResponseDTO>> getFeatures(
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

        Page<Feature> featurePage = random ? featureService.findRandom(pageable) : featureService.findAll(pageable);
        Page<FeatureResponseDTO> responsePage = featurePage.map(feature -> {
            return modelMapper.map(feature, FeatureResponseDTO.class);
        });

        return ResponseEntity.ok(responsePage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeatureResponseDTO> getFeatureById(@PathVariable Long id) {
        return featureService.findById(id)
                .map(category -> {
                    FeatureResponseDTO responseDTO = modelMapper.map(category, FeatureResponseDTO.class);
                    return ResponseEntity.ok(responseDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<FeatureResponseDTO> getFeatureByName(@RequestParam String name) {
        return featureService.findByName(name)
                .map(category -> {
                    return modelMapper.map(category, FeatureResponseDTO.class);
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createFeature(@RequestBody FeatureRequestDTO requestDTO) {
        try {
            if (featureService.existsByName(requestDTO.getName())) {
                throw new ResourceAlreadyExistsException("Feature " + requestDTO.getName() + " already exists.");
            }
            Feature feature = modelMapper.map(requestDTO, Feature.class);
            feature.setCreatedDate(LocalDateTime.now());
            feature.setUpdatedDate(LocalDateTime.now());
            feature.setActive(true);
            Feature createFeature = featureService.create(feature);
            FeatureResponseDTO responseDTO = modelMapper.map(createFeature, FeatureResponseDTO.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (ResourceAlreadyExistsException e) {
            throw new ResourceAlreadyExistsException("Feature " + requestDTO.getName() + " already exists.");
        } catch (Exception e) {
            throw new InternalServerException("Error creating feature.", e);
        }
    }
}