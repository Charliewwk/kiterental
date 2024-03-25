package com.hhr.backend.service.image;

import com.hhr.backend.entity.Image;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.ImageRepository;
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
        String name = entity.getName();
        if (imageRepository.existsByName(name)) {
            throw new ResourceAlreadyExistsException("Image with url " + name + " already exists.");
        }
        return imageRepository.save(entity);
    }

    @Override
    public Image update(Long id, Image entity) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        Optional<Image> existingImageOptional = imageRepository.findById(id);
        if (existingImageOptional.isEmpty()) {
            throw new ResourceNotFoundException("Image with ID " + id + " not found.");
        }
        Image existingImage = existingImageOptional.get();
        String newName = entity.getName();
        if (!existingImage.getName().equals(newName) && imageRepository.existsByName(newName)) {
            throw new ResourceAlreadyExistsException("Image with url " + newName + " already exists.");
        }
        return imageRepository.save(existingImage);
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        if (!imageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Image with ID " + id + " not found.");
        }
        imageRepository.deleteById(id);
    }

    @Override
    public Page<Image> findAll(Pageable pageable) {
        return imageRepository.findAll(pageable);
    }

    @Override
    public Page<Image> findRandom(Pageable pageable) {
        List<Image> allImages = imageRepository.findAll();
        Collections.shuffle(allImages);
        int pageSize = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int start = pageSize * pageNumber;
        int end = Math.min(start + pageSize, allImages.size());
        List<Image> randomImages = allImages.subList(start, end);
        return new PageImpl<>(randomImages, pageable, allImages.size());
    }

    @Override
    public Optional<Image> findById(Long id) {
        return imageRepository.findById(id);
    }

    @Override
    public Optional<Image> findByName(String name) {
        return imageRepository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        return imageRepository.existsByName(name);
    }
}
