package com.example.easy_pharma_finder.models;

import jakarta.persistence.*;

//create pharmacy_medication_cost table with below fields
@Entity
public class PharmacyMedicationCost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "pharmacy_id")
    private Pharmacy pharmacy;

    @ManyToOne
    @JoinColumn(name = "medication_id")
    private Medication medication;

    private double insurancePaidPercent;

    public PharmacyMedicationCost() {
    }

    public PharmacyMedicationCost(int id, Pharmacy pharmacy, Medication medication, double insurancePaidPercent) {
        this.id = id;
        this.pharmacy = pharmacy;
        this.medication = medication;
        this.insurancePaidPercent = insurancePaidPercent;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Pharmacy getPharmacy() {
        return pharmacy;
    }

    public void setPharmacy(Pharmacy pharmacy) {
        this.pharmacy = pharmacy;
    }

    public Medication getMedication() {
        return medication;
    }

    public void setMedication(Medication medication) {
        this.medication = medication;
    }

    public double getInsurancePaidPercent() {
        return insurancePaidPercent;
    }

    public void setInsurancePaidPercent(double insurancePaidPercent) {
        this.insurancePaidPercent = insurancePaidPercent;
    }
}
