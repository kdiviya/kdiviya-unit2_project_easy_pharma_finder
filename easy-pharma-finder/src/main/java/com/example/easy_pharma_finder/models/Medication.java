package com.example.easy_pharma_finder.models;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String medicationName;
    private BigDecimal actualCost;


    @Column(name="fk_family_member_id")
    private Integer familyMemberId;

    public Medication() {
    }

    public Medication(int id, String medicationName, BigDecimal actualCost, Integer familyMemberId) {
        this.id = id;
        this.medicationName = medicationName;
        this.actualCost = actualCost;
        this.familyMemberId = familyMemberId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }

    public BigDecimal getActualCost() {
        return actualCost;
    }

    public void setActualCost(BigDecimal actualCost) {
        this.actualCost = actualCost;
    }

    public Integer getFamilyMemberId() {
        return familyMemberId;
    }

    public void setFamilyMemberId(Integer familyMemberId) {
        this.familyMemberId = familyMemberId;
    }

    @Override
    public String toString() {
        return "Medication{" +
                "id=" + id +
                ", medicationName='" + medicationName + '\'' +
                ", actualCost=" + actualCost +
                ", familyMemberId=" + familyMemberId +
                '}';
    }
}
