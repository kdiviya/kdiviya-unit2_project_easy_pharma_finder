package com.example.easy_pharma_finder.controllers;

import com.example.easy_pharma_finder.models.User;
import com.example.easy_pharma_finder.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

//Define the connection between front end and back end
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    //used BCryptPasswordEncoder class from the spring security library for storing password in encoded format instead of plain text
    private BCryptPasswordEncoder passwordEncoder  = new BCryptPasswordEncoder(10);

    //corresponds to api end point (http://localhost:8080/api/user/login)
    @PostMapping("/login")

    //method to implement User Authentication based on credentials entered by the user.
    public ResponseEntity<?> loginAuthentication(@RequestBody User user, HttpServletRequest request) {
        Optional<User> existingUser = userRepository.findByUserName(user.getUserName());

            //Verify the existing username and the corresponding password
            if (existingUser.isPresent()) {
                User userExist = existingUser.get();
                if (passwordEncoder.matches(user.getPassword(), userExist.getPassword())) {
                    HttpSession session = request.getSession(true); //create session
                    session.setAttribute("user", userExist.getUserName()); //store the username in that session

                    //create token for that user and stored the token in the particular context to ensure authentication
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userExist.getUserName(), null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    return ResponseEntity.ok(Map.of("message", "Login successful",
                            "sessionId", session.getId(),
                            "userName", userExist.getUserName()));
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username & password");

    }
}
