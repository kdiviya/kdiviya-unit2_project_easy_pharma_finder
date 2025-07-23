package com.example.easy_pharma_finder.controllers;

import com.example.easy_pharma_finder.models.Medication;
import com.example.easy_pharma_finder.repositories.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class MedicationController {

    @Autowired
    private MedicationRepository medicationRepository;

    @GetMapping("/existingUser/medication")
    public ResponseEntity<?> getMedicationDetails(@RequestParam Integer familyMemberId) {
        List<Medication> medList = medicationRepository.findByFamilyMemberId(familyMemberId);
        System.out.println("M" +medList);
        if(!medList.isEmpty()) {

            return ResponseEntity.ok(medList);
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Medication found");
        }

    }

}
