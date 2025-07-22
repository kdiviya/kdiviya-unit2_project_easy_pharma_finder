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

    //corresponds to url (http://localhost:8080/api/user/username?userName="logged in username")
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
    //Add the new user details into the users and family_members tables.
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        //Verify the duplicates in the user table based on "email" column.
        Optional<User> existingUser = userRepository.findByEmail((user.getEmail()));
        User savedUser;
        //Check if user already exist with same email, display the message. Else create new user.
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

    //corresponds to url (http://localhost:8080/api/user//existingUser/{userId}/addFamilyMember")
    @PostMapping("/existingUser/{userId}/addFamilyMember")
    //Add new family member for the existing user
    public ResponseEntity<?> addFamilyMember(@PathVariable int userId, @RequestBody List<FamilyMember> familyMembers) {
        Optional<User> userExist = userRepository.findById(userId);

        //verify the userid exist on the user repository. if so, add all the new family members to the family_member table
        if(userExist.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        //If the user add more than one family members, iterate the loop and assign all of them in setUser().
        User userDetails = userExist.get();
        for (FamilyMember fm : familyMembers) {
            fm.setUser(userDetails);
        }

        //Store all the family members in the family member repository.
        List<FamilyMember> savedFamilyMember = familyMemberRepository.saveAll(familyMembers);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFamilyMember);
    }


    //corresponds to url (http://localhost:8080/api/user/updateUser
    @PutMapping("/updateUser")
    //update the existing user and family member's details
    public ResponseEntity<?> updateUserDetails(@RequestBody User user) {
        Optional<User> existUser = userRepository.findByUserName(user.getUserName());
        User savedUser;

        //Check if the user exist based on the username. If exists, store the updated values in savedUser.
        if (existUser.isPresent()) {
            savedUser = existUser.get();
            savedUser.setFirstName(user.getFirstName());
            savedUser.setMiddleName(user.getMiddleName());
            savedUser.setLastName(user.getLastName());
            savedUser.setUserName(user.getUserName());
            savedUser.setDob(user.getDob());
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

            //Store the updated password (if any) in encoded format.
            if (user.getPassword()!= null) {
                savedUser.setPassword(passwordEncoder.encode(user.getPassword()));
            }

            //Verify if family members exist for the existing user.
            if (user.getFamilyMembers()!=null) {

                //Iterate over all the family members, based on the id - it updates the family member details.
                for (FamilyMember familyMember : user.getFamilyMembers()) {
                    Optional<FamilyMember> existingFamilyMember = familyMemberRepository.findById(familyMember.getId());

                    if (existingFamilyMember.isPresent()) {
                            FamilyMember existing = existingFamilyMember.get();
                            existing.setName(familyMember.getName());
                            existing.setDob(familyMember.getDob());
                            existing.setRelationship(familyMember.getRelationship());
                            existing.setUser(savedUser);
                            familyMemberRepository.save(existing);

                    }

                    else {
                        familyMember.setUser(savedUser);
                        familyMemberRepository.save(familyMember);
                    }
                }
            }

            savedUser = userRepository.save(savedUser);
            return ResponseEntity.ok(savedUser);
        }

        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User details not found");
        }
    }

    //corresponds to url (http://localhost:8080/api/user/deleteFamilyMember
    @DeleteMapping("/deleteFamilyMember")
    //To delete the existing family member based on the family member id.
    public ResponseEntity<?> deleteFamilMember(@RequestBody List<Integer> familyMemberId) {

        //Using findAllById, find all id's of the family members going to be deleted
        List<FamilyMember> familyMember =  familyMemberRepository.findAllById(familyMemberId);

        if (familyMember.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Content not found");
        }

        else {
            familyMemberRepository.deleteAll(familyMember);
            return ResponseEntity.ok("Family Member/s deleted successfully");
        }
    }

}
