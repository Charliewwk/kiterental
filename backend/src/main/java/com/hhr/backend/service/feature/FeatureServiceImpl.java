package com.hhr.backend.service.feature;

import com.hhr.backend.entity.Feature;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class FeatureServiceImpl implements FeatureService{

    @Autowired
    private FeatureRepository featureRepository;

    @Override
    public Feature create(Feature entity) throws ResourceAlreadyExistsException {
        String name = entity.getName();
        if (featureRepository.existsByName(name)) {
            throw new ResourceAlreadyExistsException("Feature with name " + name + " already exists.");
        }
        return featureRepository.save(entity);
    }

    @Override
    public Feature update(Long id, Feature entity) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        Optional<Feature> existingFeatureOptional = featureRepository.findById(id);
        if (existingFeatureOptional.isEmpty()) {
            throw new ResourceNotFoundException("Feature with ID " + id + " not found.");
        }
        Feature existingFeature = existingFeatureOptional.get();
        String newName = entity.getName();
        if (!existingFeature.getName().equals(newName) && featureRepository.existsByName(newName)) {
            throw new ResourceAlreadyExistsException("Feature with name " + newName + " already exists.");
        }
        return featureRepository.save(existingFeature);
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        if (!featureRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feature with ID " + id + " not found.");
        }
        featureRepository.deleteById(id);
    }

    @Override
    public Page<Feature> findAll(Pageable pageable) {
        return featureRepository.findAll(pageable);
    }

    @Override
    public Page<Feature> findRandom(Pageable pageable) {
        List<Feature> allFeatures = featureRepository.findAll();
        Collections.shuffle(allFeatures);
        int pageSize = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int start = pageSize * pageNumber;
        int end = Math.min(start + pageSize, allFeatures.size());
        List<Feature> randomFeatures = allFeatures.subList(start, end);
        return new PageImpl<>(randomFeatures, pageable, allFeatures.size());
    }

    @Override
    public Optional<Feature> findById(Long id) {
        return featureRepository.findById(id);
    }

    @Override
    public Optional<Feature> findByName(String name) {
        return featureRepository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        return featureRepository.existsByName(name);
    }

}
