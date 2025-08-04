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


    //corresponds to url (http://localhost:8080/api/user/existingUser/medication?familyMemberId={id}
    @GetMapping("/existingUser/medication")
    //Get the medication/s for the particular family member
    public ResponseEntity<?> getMedicationDetails(@RequestParam Integer familyMemberId) {

        //get the family member values based on family member id.
        Optional<FamilyMember> familyMember = familyMemberRepository.findById(familyMemberId);

        //if the family member present, get the medication details for that member
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

    //corresponds to url (http://localhost:8080/api/user/existingUser/{userName}/family-members
    @GetMapping("/existingUser/{userName}/family-members")
    //Get all the family members based on the existing username.
    public ResponseEntity<?> getFamilyMembers(@PathVariable String userName) {
        Optional<User> userExist = userRepository.findByUserName(userName); //get the user details based on username

        if (userExist.isPresent()) {
            Integer userId = userExist.get().getId();
            List<FamilyMember> familyMemberList = familyMemberRepository.findByUserId(userId); //get the family member details based on the userid
            return ResponseEntity.ok(familyMemberList);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

}
