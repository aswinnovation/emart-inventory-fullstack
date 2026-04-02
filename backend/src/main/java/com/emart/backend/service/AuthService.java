package com.emart.backend.service;

import com.emart.backend.model.User;
import com.emart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User validateLogin(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }
}
