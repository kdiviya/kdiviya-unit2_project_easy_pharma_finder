package com.example.easy_pharma_finder.repositories;

import com.example.easy_pharma_finder.models.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Integer> {
}
