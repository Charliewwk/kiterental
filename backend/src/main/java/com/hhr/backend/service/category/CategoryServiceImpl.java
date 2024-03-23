package com.hhr.backend.service.category;

import com.hhr.backend.entity.Category;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category create(Category category) throws ResourceAlreadyExistsException {
        if (categoryRepository.existsByName(category.getName())) {
            throw new ResourceAlreadyExistsException("Category with name " + category.getName() + " already exists.");
        }
        return categoryRepository.save(category);
    }

    @Override
    public Category update(Long id, Category entity) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        return entity;
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
    }

    @Override
    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    @Override
    public Page<Category> findRandom(Pageable pageable) {
        return null;
    }

    @Override
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }

}
