package com.example.backend.payload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class ErrorDetails {

    private Date timestamp;
    private String error;
    private String message;
    private String path;

    public ErrorDetails(Date timestamp, String error, String message, String path) {
        this.timestamp = timestamp;
        this.error = error;
        this.message = message;
        this.path = path.replace("uri=", "");
    }

}
