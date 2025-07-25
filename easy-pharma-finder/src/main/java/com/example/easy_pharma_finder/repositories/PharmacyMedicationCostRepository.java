package com.example.easy_pharma_finder.repositories;

import com.example.easy_pharma_finder.models.PharmacyMedicationCost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface PharmacyMedicationCostRepository extends JpaRepository<PharmacyMedicationCost, Integer> {
    Optional<PharmacyMedicationCost> findByPharmacyIdAndMedicationId(Integer pharmacyId, Integer medicationId);
}
