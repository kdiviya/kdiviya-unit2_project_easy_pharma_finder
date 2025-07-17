package com.example.easy_pharma_finder.controllers;

import com.example.easy_pharma_finder.models.FamilyMember;
import com.example.easy_pharma_finder.models.User;
import com.example.easy_pharma_finder.repositories.FamilyMemberRepository;
import com.example.easy_pharma_finder.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/submit")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        //Verify the duplicates in the user table based on "email" column.
        Optional<User> existingUser = userRepository.findByEmail((user.getEmail()));
        User savedUser;
        //Check if user found with same email, update the details of the corresponding user.Else create new user
        if (existingUser.isPresent()) {
            savedUser = existingUser.get();
            savedUser.setFirstName(user.getFirstName());
            savedUser.setMiddleName(user.getMiddleName());
            savedUser.setLastName(user.getLastName());
            savedUser.setUserName(user.getUserName());
            savedUser.setDob(user.getDob());
            savedUser.setPassword(passwordEncoder.encode(user.getPassword()));
            savedUser.setEmail(user.getEmail());
            savedUser.setContactNo(user.getContactNo());
            savedUser.setLastVisitedDate(user.getLastVisitedDate());
            savedUser.setStreet(user.getStreet());
            savedUser.setCity(user.getCity());
            savedUser.setCountry(user.getCountry());
            savedUser.setState(user.getState());
            savedUser.setZipCode(user.getZipCode());
            savedUser.setInsuranceNumber(user.getInsuranceNumber());
            savedUser.setInsuranceProvider(user.getInsuranceProvider());
            savedUser.setInsuranceType(user.getInsuranceType());
            savedUser.setIsFamilyMember(user.getIsFamilyMember());
            savedUser = userRepository.save(savedUser);
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            savedUser = userRepository.save(user);
        }
        //check if family member exists for the primary user.
        if (user.getFamilyMembers() != null && !user.getFamilyMembers().isEmpty()) {
            //Iterate over the loop for all the family members to check the family member already exist in the same table.
            for (FamilyMember familyMember : user.getFamilyMembers()) {
                List<FamilyMember> existingFamilyMember = familyMemberRepository.findByNameAndRelationshipAndDobAndUser(familyMember.getName(), familyMember.getRelationship(), familyMember.getDob(), savedUser);

                //If the family members name, dob, relationship already exist - update the existing one, else - create new value.
                if (!existingFamilyMember.isEmpty()) {
                    for (FamilyMember existing : existingFamilyMember) {
                        existing.setName(familyMember.getName());
                        existing.setDob(familyMember.getDob());
                        existing.setRelationship(familyMember.getRelationship());
                        existing.setUser(savedUser);
                        familyMemberRepository.save(existing);
                    }
                } else {
                    familyMember.setUser(savedUser);
                    familyMemberRepository.save(familyMember);
                }
            }
        }
        return ResponseEntity.ok(savedUser);
    }

}
