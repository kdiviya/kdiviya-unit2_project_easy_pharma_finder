package com.example.easy_pharma_finder.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;

@Entity
public class PharmacyMedicationCost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int pharmacyId;
    private int medicationId;
    private double insurancePaidPercent;


    public PharmacyMedicationCost() {
    }

    public PharmacyMedicationCost(int id, int pharmacyId, int medicationId, double insurancePaidPercent) {
        this.id = id;
        this.pharmacyId = pharmacyId;
        this.medicationId = medicationId;
        this.insurancePaidPercent = insurancePaidPercent;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPharmacyId() {
        return pharmacyId;
    }

    public void setPharmacyId(int pharmacyId) {
        this.pharmacyId = pharmacyId;
    }

    public int getMedicationId() {
        return medicationId;
    }

    public void setMedicationId(int medicationId) {
        this.medicationId = medicationId;
    }

    public double getInsurancePaidPercent() {
        return insurancePaidPercent;
    }

    public void setInsurancePaidPercent(double insurancePaidPercent) {
        this.insurancePaidPercent = insurancePaidPercent;
    }
}
