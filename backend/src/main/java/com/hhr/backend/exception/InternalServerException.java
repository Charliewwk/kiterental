package com.hhr.backend.exception;

public class InternalServerException extends RuntimeException {
    public InternalServerException(String message, Exception e){
        super(message);
    }

}
