package com.example.easy_pharma_finder.models;

import java.math.BigDecimal;

public class PharmacyMedicationCost {

    private String pharmacyName;
    private String MedicationName;
    private int userId;
    private String userName;
    private double actualCost;
    private double insurancePaidPercent;
    private double totalCost;

    public PharmacyMedicationCost() {
    }

    public PharmacyMedicationCost(String pharmacyName, String medicationName, int userId, String userName, double actualCost, double insurancePaidPercent, double totalCost) {
        this.pharmacyName = pharmacyName;
        MedicationName = medicationName;
        this.userId = userId;
        this.userName = userName;
        this.actualCost = actualCost;
        this.insurancePaidPercent = insurancePaidPercent;
        this.totalCost = totalCost;
    }

    public String getPharmacyName() {
        return pharmacyName;
    }

    public void setPharmacyName(String pharmacyName) {
        this.pharmacyName = pharmacyName;
    }

    public String getMedicationName() {
        return MedicationName;
    }

    public void setMedicationName(String medicationName) {
        MedicationName = medicationName;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public double getActualCost() {
        return actualCost;
    }

    public void setActualCost(double actualCost) {
        this.actualCost = actualCost;
    }

    public double getInsurancePaidPercent() {
        return insurancePaidPercent;
    }

    public void setInsurancePaidPercent(double insurancePaidPercent) {
        this.insurancePaidPercent = insurancePaidPercent;
    }

    public double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(double totalCost) {
        this.totalCost = totalCost;
    }
}
