package com.hhr.backend.service.image;

import com.hhr.backend.entity.Image;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.ImageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Image create(Image entity) throws ResourceAlreadyExistsException {
        logger.info("createImage method: Getting started.");
        String name = entity.getName();
        if (imageRepository.existsByName(name)) {
            logger.info("createImage method: Image with name " + name + " already exists.");
            throw new ResourceAlreadyExistsException("Image with name " + name + " already exists.");
        }
        logger.info("createImage method: Successful image registration");
        return imageRepository.save(entity);
    }

    @Override
    public Image update(Long id, Image entity) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        logger.info("updateImage method: Getting started.");
        Optional<Image> existingImageOptional = imageRepository.findById(id);
        if (existingImageOptional.isEmpty()) {
            logger.info("updateImage method: Image with ID " + id + " not found.");
            throw new ResourceNotFoundException("Image with ID " + id + " not found.");
        }
        Image existingImage = existingImageOptional.get();
        String newName = entity.getName();
        if (!existingImage.getName().equals(newName) && imageRepository.existsByName(newName)) {
            logger.info("updateImage method: Image with name " + newName + " already exists.");
            throw new ResourceAlreadyExistsException("Image with name " + newName + " already exists.");
        }
        logger.info("updateImage method: Successful image modification");
        return imageRepository.save(existingImage);
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        logger.info("deleteImage method: Getting started.");
        if (!imageRepository.existsById(id)) {
            logger.info("deleteImage method: Image with ID " + id + " not found.");
            throw new ResourceNotFoundException("Image with ID " + id + " not found.");
        }
        logger.info("deleteImage method: Successful image removal");
        imageRepository.deleteById(id);
    }

    @Override
    public Page<Image> findAll(Pageable pageable) {
        logger.info("findAllImage method: Executed.");
        return imageRepository.findAll(pageable);
    }

    @Override
    public Page<Image> findRandom(Pageable pageable) {
        logger.info("findRandomImage method: Getting started.");
        List<Image> allImages = imageRepository.findAll();
        Collections.shuffle(allImages);
        int pageSize = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int start = pageSize * pageNumber;
        int end = Math.min(start + pageSize, allImages.size());
        List<Image> randomImages = allImages.subList(start, end);
        logger.info("findRandomImage method: Getting Finalized.");
        return new PageImpl<>(randomImages, pageable, allImages.size());
    }

    @Override
    public Optional<Image> findById(Long id) {
        logger.info("findByIdImage method: Executed.");
        return imageRepository.findById(id);
    }

    @Override
    public Optional<Image> findByName(String name) {
        logger.info("findByIdImage method: Executed.");
        return imageRepository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        logger.info("findByIdImage method: Executed.");
        return imageRepository.existsByName(name);
    }

}
