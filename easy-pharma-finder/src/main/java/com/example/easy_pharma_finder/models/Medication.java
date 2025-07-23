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
    private BigDecimal insurancePaidPercent;

    @Column(name="fk_family_member_id")
    private int familyMemberId;
    private BigDecimal copay;

    public Medication() {
    }

    public Medication(int id, String medicationName, BigDecimal actualCost, BigDecimal insurancePaidPercent, int familyMemberId, BigDecimal copay) {
        this.id = id;
        this.medicationName = medicationName;
        this.actualCost = actualCost;
        this.insurancePaidPercent = insurancePaidPercent;

        this.familyMemberId = familyMemberId;
        this.copay = copay;
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

    public BigDecimal getInsurancePaidPercent() {
        return insurancePaidPercent;
    }

    public void setInsurancePaidPercent(BigDecimal insurancePaidPercent) {
        this.insurancePaidPercent = insurancePaidPercent;
    }


    public int getFamilyMemberId() {
        return familyMemberId;
    }

    public void setFamilyMemberId(int familyMemberId) {
        this.familyMemberId = familyMemberId;
    }

    public BigDecimal getCopay() {
        return copay;
    }

    public void setCopay(BigDecimal copay) {
        this.copay = copay;
    }
}
