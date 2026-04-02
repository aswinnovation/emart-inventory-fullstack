package com.emart.backend.repository;

import com.emart.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by username (if needed elsewhere)
    Optional<User> findByUsername(String username);

    // Required for login
    User findByEmailAndPassword(String email, String password);
}
