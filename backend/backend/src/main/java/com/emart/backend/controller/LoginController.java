
package com.emart.backend.controller;

import com.emart.backend.dto.LoginRequest;
import com.emart.backend.model.User;
import com.emart.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        User user = authService.validateLogin(request.getEmail(), request.getPassword());
        if (user != null) {
            return user;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
