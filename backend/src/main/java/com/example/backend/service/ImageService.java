package com.example.backend.service;

import com.example.backend.repository.ImageRepository;
import com.example.backend.dto.ImageRequestDTO;
import com.example.backend.dto.ImageResponseDTO;
import com.example.backend.entity.Image;
import com.example.backend.entity.Product;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final ModelMapper modelMapper;

    public ImageService(ImageRepository imageRepository, ModelMapper modelMapper) {
        this.imageRepository = imageRepository;
        this.modelMapper = modelMapper;
    }

    public ImageResponseDTO createImage(ImageRequestDTO imageRequestDTO) {
        Image image = modelMapper.map(imageRequestDTO, Image.class);
        Image savedImage = imageRepository.save(image);
        return modelMapper.map(savedImage, ImageResponseDTO.class);
    }

    public ImageResponseDTO getImageById(Long imageId) {
        Image image = imageRepository.findById(imageId).orElse(null);
        return (image != null) ? modelMapper.map(image, ImageResponseDTO.class) : null;
    }

    public List<ImageResponseDTO> getAllImages() {
        List<Image> images = imageRepository.findAll();
        return images.stream()
                .map(image -> modelMapper.map(image, ImageResponseDTO.class))
                .collect(Collectors.toList());
    }

    public List<ImageResponseDTO> getAllImagesByProduct(Product product) {
        List<Image> images = imageRepository.findByProduct(product);
        return images.stream()
                .map(image -> modelMapper.map(image, ImageResponseDTO.class))
                .collect(Collectors.toList());
    }

}

