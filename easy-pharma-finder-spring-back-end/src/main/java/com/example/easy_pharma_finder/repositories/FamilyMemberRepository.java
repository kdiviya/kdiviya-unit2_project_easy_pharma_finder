package com.example.easy_pharma_finder.repositories;

import com.example.easy_pharma_finder.models.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Integer> {
    List<FamilyMember> findByUserId(Integer userId);

}
