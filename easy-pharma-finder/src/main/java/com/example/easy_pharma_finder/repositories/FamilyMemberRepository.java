package com.example.easy_pharma_finder.repositories;

import com.example.easy_pharma_finder.models.FamilyMember;
import com.example.easy_pharma_finder.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Integer> {
    //Select all the values from the family_member table based on name,relationship, dob,
    List<FamilyMember> findById(int id);
}
