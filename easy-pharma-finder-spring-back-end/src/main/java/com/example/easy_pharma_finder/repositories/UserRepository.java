package com.example.easy_pharma_finder.repositories;

import com.example.easy_pharma_finder.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserName(String userName); //Query the user table, retrieve all the values based on username.
}
