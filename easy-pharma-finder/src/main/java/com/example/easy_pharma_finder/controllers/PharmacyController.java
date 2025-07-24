package com.example.easy_pharma_finder.controllers;


import com.example.easy_pharma_finder.models.Pharmacy;
import com.example.easy_pharma_finder.models.User;
import com.example.easy_pharma_finder.repositories.PharmacyRepository;
import com.example.easy_pharma_finder.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class PharmacyController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PharmacyRepository pharmacyRepository;

    @GetMapping("/pharmacy-details")
    public ResponseEntity<?> getPharmacyDetails(@RequestParam String userName) {
        Optional<User> user = userRepository.findByUserName(userName);
        List<String> pharmacyNames = new ArrayList<>();

        if(user.isPresent()) {
            String zipCode = user.get().getZipCode();
            List<Pharmacy> pharmacies = pharmacyRepository.findByZipCode(zipCode);

            if(!pharmacies.isEmpty()) {
                for(Pharmacy pharmacy : pharmacies ) {
                    pharmacyNames.add(pharmacy.getPharmacyName());
                }
                return  ResponseEntity.ok(pharmacyNames);
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Content not found");

    }



}
