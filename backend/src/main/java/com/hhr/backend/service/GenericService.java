package com.hhr.backend.service;

import com.hhr.backend.exception.ResourceAlreadyExistsException;
import com.hhr.backend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface GenericService<T, ID> {

    T create(T entity) throws ResourceAlreadyExistsException;
    T update(ID id, T entity) throws ResourceNotFoundException, ResourceAlreadyExistsException;
    void delete(ID id) throws ResourceNotFoundException;
    Page<T> findAll(Pageable pageable);
    Optional<T> findById(ID id);
    Optional<T> findByName(String name);

}
