package com.hhr.backend.service.category;

import com.hhr.backend.entity.Category;
import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import com.hhr.backend.repository.CategoryRepository;
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
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    @Override
    public Category create(Category category) throws ResourceAlreadyExistsException {
        logger.info("createCategory method: Getting started.");
        if (categoryRepository.existsByName(category.getName())) {
            logger.info("createCategory method: Category with name " + category.getName() + " already exists.");
            throw new ResourceAlreadyExistsException("Category with name " + category.getName() + " already exists.");
        }
        logger.info("createCategory method: Successful category registration");
        return categoryRepository.save(category);
    }

    @Transactional
    @Override
    public Category update(Long id, Category entity) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        logger.info("updateCategory method: Getting started.");
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            logger.info("updateCategory method: Category with ID " + id + " not found.");
            throw new ResourceNotFoundException("Category with ID " + id + " not found.");
        }
        Category existingCategory = optionalCategory.get();
        if (!existingCategory.getName().equals(entity.getName()) && categoryRepository.existsByName(entity.getName())) {
            logger.info("updateCategory method: Category with name " + entity.getName() + " already exists.");
            throw new ResourceAlreadyExistsException("Category with name " + entity.getName() + " already exists.");
        }
        logger.info("updateCategory method: Successful category modification");
        return categoryRepository.save(existingCategory);
    }

    @Transactional
    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        logger.info("deleteCategory method: Getting started.");
        if (!categoryRepository.existsById(id)) {
            logger.info("deleteCategory method: Category with ID " + id + " not found.");
            throw new ResourceNotFoundException("Category with ID " + id + " not found.");
        }
        logger.info("deleteCategory method: Successful category removal");
        categoryRepository.deleteById(id);
    }

    @Override
    public Page<Category> findAll(Pageable pageable) {
        logger.info("findAllCategory method: Executed.");
        return categoryRepository.findAll(pageable);
    }

    @Override
    public Page<Category> findRandom(Pageable pageable) {
        logger.info("findRandomCategory method: Getting started.");
        List<Category> allCategories = categoryRepository.findAll();
        Collections.shuffle(allCategories);
        int pageSize = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int start = pageSize * pageNumber;
        int end = Math.min(start + pageSize, allCategories.size());
        List<Category> randomCategories = allCategories.subList(start, end);
        logger.info("findRandomCategory method: Getting Finalized.");
        return new PageImpl<>(randomCategories, pageable, allCategories.size());
    }

    @Override
    public Optional<Category> findById(Long id) {
        logger.info("findByIdCategory method: Executed.");
        return categoryRepository.findById(id);
    }

    @Override
    public Optional<Category> findByName(String name) {
        logger.info("findByNameCategory method: Executed.");
        return categoryRepository.findByName(name);
    }

    @Override
    public boolean existsByName(String name) {
        logger.info("existsByNameCategory method: Executed.");
        return categoryRepository.existsByName(name);
    }

}
