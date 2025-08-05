package com.example.easy_pharma_finder.controllers;

import com.example.easy_pharma_finder.models.*;
import com.example.easy_pharma_finder.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

//Define the connection between front end and back end
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

    //corresponds to url (http://localhost:8080/api/user/pharmacy-details?userName="logged in username"&familyMemberId="id")
    @GetMapping("/pharmacy-details")
    //Get the pharmacy details based on user's zipcode and get the medication based on the family member id
    public ResponseEntity<?> getPharmacyDetails(@RequestParam("userName") String userName, @RequestParam("familyMemberId") int familyMemberId) {

        Optional<User> user = userRepository.findByUserName(userName);
        double insurancePaidPercent = 0.0;
        List<Map<String, Object>> responseDetails= new ArrayList<>();

        if (user.isEmpty()) {
            return ResponseEntity.ok(Map.of("info", "User not found.", "results", Collections.emptyList()));
        }
        String zipCode = user.get().getZipCode();
        List<Pharmacy> pharmacies = pharmacyRepository.findByZipCode(zipCode);

        if (pharmacies.isEmpty()) {
            return ResponseEntity.ok(Map.of("info", "No pharmacies found for this zip code.", "results", Collections.emptyList()));
        }

       Optional<FamilyMember> familyMember = familyMemberRepository.findById(familyMemberId);
        if (familyMember.isEmpty()) {
            return ResponseEntity.ok(Map.of("info", "No medications found for the selected family member.", "results", Collections.emptyList()));
        }

        List<Medication> medications = familyMember.get().getMedications();

        if (medications.isEmpty()) {
            return ResponseEntity.ok(Map.of("info", "No medications found for this user.", "results", Collections.emptyList()));
        }

        //Iterate over the loop for all the medication associated with particular family member
        for (Medication med : medications) {
            for (Pharmacy pharmacy : pharmacies) {

                //query the table based on med and pharmacy id
                Optional<PharmacyMedicationCost> medPercent = pharmacyMedicationCostRepository.findByPharmacyIdAndMedicationId(pharmacy.getId(), med.getId());

                if (medPercent.isPresent()) {
                    insurancePaidPercent = medPercent.get().getInsurancePaidPercent();
                    double actualCost = med.getActualCost() * (1 - insurancePaidPercent / 100.0);
                    Map<String, Object> map = new HashMap<>();
                    map.put("pharmacyName", pharmacy.getPharmacyName());
                    map.put("pharmacyUrl", pharmacy.getUrl());
                    map.put("homeDelivery", pharmacy.getIsHomeDelivery());
                    map.put("medicationName", med.getMedicationName());
                    map.put("medicationCost", med.getActualCost());
                    map.put("insurancePaidPercent", insurancePaidPercent);
                    map.put("copay", actualCost);

                    responseDetails.add(map);
                }
            }
        }

        if (responseDetails.isEmpty()) {
            return ResponseEntity.ok(Map.of("info", "No cost breakdown data found.", "results", Collections.emptyList()));
        }

        return ResponseEntity.ok(Map.of("info","success", "results",responseDetails));
    }
}
