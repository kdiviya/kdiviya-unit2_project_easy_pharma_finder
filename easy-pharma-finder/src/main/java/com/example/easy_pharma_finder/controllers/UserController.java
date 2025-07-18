package com.example.easy_pharma_finder.controllers;

import com.example.easy_pharma_finder.models.FamilyMember;
import com.example.easy_pharma_finder.models.User;
import com.example.easy_pharma_finder.repositories.FamilyMemberRepository;
import com.example.easy_pharma_finder.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FamilyMemberRepository familyMemberRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    //corresponds to url (http://localhost:8080/api/user/username)
    @GetMapping("/username")
    //Display the user details for the logged-in user.
    public ResponseEntity<?> getUserDetails(@RequestParam String userName) {
        Optional<User> userProfile  = userRepository.findByUserName(userName);
        if (userProfile.isPresent()) {
            User user = userProfile.get();
            return ResponseEntity.ok(user);
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    //corresponds to url (http://localhost:8080/api/user/submit)
    @PostMapping("/submit")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        //Verify the duplicates in the user table based on "email" column.
        Optional<User> existingUser = userRepository.findByEmail((user.getEmail()));
        User savedUser;
        //Check if user already exist with same email, display the message.Else create new user.
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with same email already exist");
        }

        //check if family member exists for the primary user.
        if (user.getFamilyMembers() != null && !user.getFamilyMembers().isEmpty()) {
            //Iterate over the loop for all the family members and stored all of them in the table.
            for (FamilyMember familyMember : user.getFamilyMembers()) {
                    familyMember.setUser(user);
            }
        }

        try {
            //store all the new user details in the user table and store the encoded password instead of plain text.
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            savedUser = userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        }
        catch(DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or Email already exists. Please choose another.");
        }
    }

}
