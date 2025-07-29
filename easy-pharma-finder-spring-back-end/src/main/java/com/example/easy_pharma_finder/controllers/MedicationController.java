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

    @GetMapping("/existingUser/medication")
    public ResponseEntity<?> getMedicationDetails(@RequestParam Integer familyMemberId) {

        List<Medication>  medList = medicationRepository.findByFamilyMemberId(familyMemberId);

        if(!medList.isEmpty()) {
            return ResponseEntity.ok(medList);
        }
        else {
            medList = medicationRepository.findTop2ByFamilyMemberIdIsNull();

           if (!medList.isEmpty()) {
                for(Medication med : medList) {
                    med.setFamilyMemberId(familyMemberId);
                }
                medicationRepository.saveAll(medList);
                return ResponseEntity.ok(medList);
            }
            else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Medication found");
            }
        }

    }

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
