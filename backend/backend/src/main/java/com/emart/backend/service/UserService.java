package com.emart.backend.service;

import com.emart.backend.model.User;

import java.util.List;

public interface UserService {
    User registerUser(User user);
    List<User> getAllUsers();
    User getUserById(Long id);
    User findByUsername(String username);
}
