package com.hhr.backend.service.feature;

import com.hhr.backend.entity.Feature;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.FeatureRepository;
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
public class FeatureServiceImpl implements FeatureService{

    @Autowired
    private FeatureRepository featureRepository;

    @Override
    public Feature create(Feature entity) throws ResourceAlreadyExistsException {
        logger.info("createFeature method: Getting started.");
        String name = entity.getName();
        if (featureRepository.existsByName(name)) {
            logger.info("createFeature method: Feature with name " + name + " already exists.");
            throw new ResourceAlreadyExistsException("Feature with name " + name + " already exists.");
        }
        logger.info("createFeature method: Successful feature registration");
        return featureRepository.save(entity);
    }

    @Override
    public Feature update(Long id, Feature entity) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        logger.info("updateFeature method: Getting started.");
        Optional<Feature> existingFeatureOptional = featureRepository.findById(id);
        if (existingFeatureOptional.isEmpty()) {
            logger.info("updateFeature method: Feature with ID " + id + " not found.");
            throw new ResourceNotFoundException("Feature with ID " + id + " not found.");
        }
        Feature existingFeature = existingFeatureOptional.get();
        String newName = entity.getName();
        if (!existingFeature.getName().equals(newName) && featureRepository.existsByName(newName)) {
            logger.info("updateFeature method: Feature with name " + newName + " already exists.");
            throw new ResourceAlreadyExistsException("Feature with name " + newName + " already exists.");
        }
        logger.info("updateFeature method: Successful feature modification");
        return featureRepository.save(existingFeature);
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        logger.info("deleteFeature method: Getting started.");
        if (!featureRepository.existsById(id)) {
            logger.info("deleteFeature method: Feature with ID " + id + " not found.");
            throw new ResourceNotFoundException("Feature with ID " + id + " not found.");
        }
        logger.info("deleteFeature method: Successful feature removal");
        featureRepository.deleteById(id);
    }

    @Override
    public Page<Feature> findAll(Pageable pageable) {
        logger.info("findAllFeature method: Executed.");
        return featureRepository.findAll(pageable);
    }

    @Override
    public Page<Feature> findRandom(Pageable pageable) {
        logger.info("findRandomFeature method: Getting started.");
        List<Feature> allFeatures = featureRepository.findAll();
        Collections.shuffle(allFeatures);
        int pageSize = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int start = pageSize * pageNumber;
        int end = Math.min(start + pageSize, allFeatures.size());
        List<Feature> randomFeatures = allFeatures.subList(start, end);
        logger.info("findRandomFeature method: Getting Finalized.");
        return new PageImpl<>(randomFeatures, pageable, allFeatures.size());
    }

    @Override
    public Optional<Feature> findById(Long id) {
        logger.info("findByIdFeature method: Executed.");
        return featureRepository.findById(id);
    }

    @Override
    public Optional<Feature> findByName(String name) {
        logger.info("findByIdFeature method: Executed.");
        return featureRepository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        logger.info("findByIdFeature method: Executed.");
        return featureRepository.existsByName(name);
    }

}
