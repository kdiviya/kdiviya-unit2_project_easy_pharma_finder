package com.example.easy_pharma_finder.controllers;


import com.example.easy_pharma_finder.models.*;
import com.example.easy_pharma_finder.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class PharmacyController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PharmacyRepository pharmacyRepository;
    @Autowired
    private MedicationRepository medicationRepository;
    @Autowired
    private FamilyMemberRepository familyMemberRepository;
    @Autowired
    private PharmacyMedicationCostRepository pharmacyMedicationCostRepository;

    @GetMapping("/pharmacy-details")
    public ResponseEntity<?> getPharmacyDetails(@RequestParam String userName, @RequestParam int familyMemberId) {
        List<String> pharmacyNames = new ArrayList<>();
        Optional<User> user = userRepository.findByUserName(userName);
        double insurancePaidPercent = 0.0;
        List<Map<String, Object>> responseDetails= new ArrayList<>();

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        String zipCode = user.get().getZipCode();
        List<Pharmacy> pharmacies = pharmacyRepository.findByZipCode(zipCode);

        if (pharmacies.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No pharmacies found for this zip code");
        }
        List<Medication> memberMedList = medicationRepository.findByFamilyMemberId(familyMemberId);
        if (memberMedList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No medications found for the selected family member");
        }

        for (Medication med : memberMedList) {
            for (Pharmacy pharmacy : pharmacies) {
                Optional<PharmacyMedicationCost> medPercent = pharmacyMedicationCostRepository.findByPharmacyIdAndMedicationId(pharmacy.getId(), med.getId());
                if (medPercent.isPresent()) {
                    System.out.println("med:" + medPercent);
                    insurancePaidPercent = medPercent.get().getInsurancePaidPercent();
                    double actualCost = med.getActualCost() * (1 - insurancePaidPercent / 100.0);
                    Map<String, Object> map = new HashMap<>();
                    map.put("pharmacyName", pharmacy.getPharmacyName());
                    map.put("medicationName", med.getMedicationName());
                    map.put("medicationCost", med.getActualCost());
                    map.put("insurancePaidPercent", insurancePaidPercent);
                    map.put("copay", actualCost);

                    responseDetails.add(map);
                }
            }

        }

        if (responseDetails.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Content not found");
        }

        return ResponseEntity.ok(responseDetails);
    }
}
