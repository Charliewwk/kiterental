package com.hhr.backend.config;
import com.hhr.backend.entity.User;
import com.hhr.backend.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserUtils {

    @Autowired
    private UserService userService;

    public User getUserByUsername(String username) {
        return userService.findByUsername(username);
    }
}