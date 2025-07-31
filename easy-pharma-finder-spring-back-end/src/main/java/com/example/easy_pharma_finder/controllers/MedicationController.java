package com.example.easy_pharma_finder.controllers;

import com.example.easy_pharma_finder.models.FamilyMember;
import com.example.easy_pharma_finder.models.Medication;
import com.example.easy_pharma_finder.models.User;
import com.example.easy_pharma_finder.repositories.FamilyMemberRepository;
import com.example.easy_pharma_finder.repositories.MedicationRepository;
import com.example.easy_pharma_finder.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

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

    //Get the medication/s for the particular family member
    @GetMapping("/existingUser/medication")
    public ResponseEntity<?> getMedicationDetails(@RequestParam Integer familyMemberId) {

        Optional<FamilyMember> familyMember = familyMemberRepository.findById(familyMemberId);

        if(familyMember.isPresent()) {
            List<Medication> medications = familyMember.get().getMedications();
            if(!medications.isEmpty()){
                return ResponseEntity.ok(medications);
            }
            else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No medications found");
            }
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Family member not found");
        }

    }

    //Get the family members based on the existing username.
    @GetMapping("/existingUser/{userName}/family-members")
    public ResponseEntity<?> getFamilyMembers(@PathVariable String userName) {
        Optional<User> userExist = userRepository.findByUserName(userName);

        if (userExist.isPresent()) {
            Integer userId = userExist.get().getId();
            List<FamilyMember> familyMemberList = familyMemberRepository.findByUserId(userId);
            return ResponseEntity.ok(familyMemberList);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");


    }

}
