package com.example.easy_pharma_finder.repositories;

import com.example.easy_pharma_finder.models.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Integer> {
    List<Pharmacy> findByZipCode(String zipCode); //Query pharmacy table and return all the values based on Zipcode.
}
