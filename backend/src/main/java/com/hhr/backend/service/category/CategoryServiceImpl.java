package com.hhr.backend.service.category;

import com.hhr.backend.entity.Category;
import com.hhr.backend.entity.Product;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
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
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            throw new ResourceNotFoundException("Category with ID " + id + " not found.");
        }
        Category existingCategory = optionalCategory.get();
        if (!existingCategory.getName().equals(entity.getName()) && categoryRepository.existsByName(entity.getName())) {
            throw new ResourceAlreadyExistsException("Category with name " + entity.getName() + " already exists.");
        }
        return categoryRepository.save(existingCategory);
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category with ID " + id + " not found.");
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    @Override
    public Page<Category> findRandom(Pageable pageable) {
        List<Category> allCategories = categoryRepository.findAll();
        Collections.shuffle(allCategories);
        int pageSize = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int start = pageSize * pageNumber;
        int end = Math.min(start + pageSize, allCategories.size());
        List<Category> randomCategories = allCategories.subList(start, end);
        return new PageImpl<>(randomCategories, pageable, allCategories.size());
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
