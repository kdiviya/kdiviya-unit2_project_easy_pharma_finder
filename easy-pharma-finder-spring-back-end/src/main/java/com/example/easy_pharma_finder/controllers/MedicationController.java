package com.example.easy_pharma_finder.controllers;

import com.example.easy_pharma_finder.models.FamilyMember;
import com.example.easy_pharma_finder.models.User;
import com.example.easy_pharma_finder.repositories.FamilyMemberRepository;
import com.example.easy_pharma_finder.repositories.MedicationRepository;
import com.example.easy_pharma_finder.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;


//Define the connection between front end and back end
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class MedicationController {

    @Autowired
    private MedicationRepository medicationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FamilyMemberRepository familyMemberRepository;

    //corresponds to url (http://localhost:8080/api/user/existingUser/{userName}/family-members
    @GetMapping("/existingUser/{userName}/family-members")
    //Get all the family members based on the existing username.
    public ResponseEntity<?> getFamilyMembers(@PathVariable("userName") String userName) {
        Optional<User> userExist = userRepository.findByUserName(userName); //get the user details based on username

        if (userExist.isPresent()) {
            Integer userId = userExist.get().getId();
            List<FamilyMember> familyMemberList = familyMemberRepository.findByUserId(userId); //get the family member details based on the userid
            if (!familyMemberList.isEmpty()) {
                return ResponseEntity.ok(Map.of("info", "Family members found", "results", familyMemberList));
            }
            else {
                return ResponseEntity.ok(Map.of("info", "No family members found", "results", Collections.emptyList()));
            }
        }
        return ResponseEntity.ok(Map.of("info", "User not found", "results", Collections.emptyList()));
    }

}
