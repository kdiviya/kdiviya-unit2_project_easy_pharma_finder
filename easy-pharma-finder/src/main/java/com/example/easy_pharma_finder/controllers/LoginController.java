package com.example.easy_pharma_finder.controllers;

import com.example.easy_pharma_finder.models.User;
import com.example.easy_pharma_finder.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class LoginController {

    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder  = new BCryptPasswordEncoder(12);
    @PostMapping("/login")
    public ResponseEntity<String> loginAuthentication(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByUserName(user.getUserName());

        if (existingUser.isPresent()) {
            User userExist =  existingUser.get();
            if (passwordEncoder.matches(user.getPassword(), userExist.getPassword())) {
                return ResponseEntity.ok("Login Successfully");
            }
            else {
                return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username & password");
            }
        }

        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not Authorized user");
        }

    }

}
