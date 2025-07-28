package com.example.easy_pharma_finder.repositories;

import com.example.easy_pharma_finder.models.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MedicationRepository extends JpaRepository<Medication, Integer> {
    List<Medication> findByFamilyMemberId(Integer familyMemberId);
    List<Medication> findTop2ByFamilyMemberIdIsNull();
}
