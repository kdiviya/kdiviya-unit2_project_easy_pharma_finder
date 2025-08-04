package com.example.easy_pharma_finder.repositories;

import com.example.easy_pharma_finder.models.PharmacyMedicationCost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PharmacyMedicationCostRepository extends JpaRepository<PharmacyMedicationCost, Integer> {

    //Query the Pharmacy_medication_cost table and return all the values based on pharmacy id and medication id.
    Optional<PharmacyMedicationCost> findByPharmacyIdAndMedicationId(Integer pharmacyId, Integer medicationId);

}
