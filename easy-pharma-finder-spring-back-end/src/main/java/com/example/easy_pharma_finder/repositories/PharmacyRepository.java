package com.example.easy_pharma_finder.repositories;

import com.example.easy_pharma_finder.models.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Integer> {
    List<Pharmacy> findByZipCode(String zipCode);

}
