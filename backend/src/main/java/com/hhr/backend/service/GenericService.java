package com.hhr.backend.service;

import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.apache.log4j.Logger;
import java.util.Optional;

public interface GenericService<T, ID> {
    static final Logger logger = Logger.getLogger(GenericService.class);
    @Transactional
    T create(T entity) throws ResourceAlreadyExistsException;
    @Transactional
    T update(ID id, T entity) throws ResourceNotFoundException, ResourceAlreadyExistsException;
    @Transactional
    void delete(ID id) throws ResourceNotFoundException;
    Page<T> findAll(Pageable pageable);
    Page<T> findRandom(Pageable pageable);
    Optional<T> findById(ID id);
    Optional<T> findByName(String name);
    boolean existsByName(String name);

}
