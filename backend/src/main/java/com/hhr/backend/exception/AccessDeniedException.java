package com.hhr.backend.exception;

public class AccessDeniedException extends RuntimeException{
    public AccessDeniedException(String message, Exception e){
        super(message);
    }
}
