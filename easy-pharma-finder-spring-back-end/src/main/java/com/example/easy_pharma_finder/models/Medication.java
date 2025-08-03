package com.example.easy_pharma_finder.models;

import jakarta.persistence.*;

//create medication table with below fields.
@Entity
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String medicationName;
    private double actualCost;

    public Medication() {
    }

    public Medication(int id, String medicationName, double actualCost) {
        this.id = id;
        this.medicationName = medicationName;
        this.actualCost = actualCost;
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

    public double getActualCost() {
        return actualCost;
    }

    public void setActualCost(double actualCost) {
        this.actualCost = actualCost;
    }

    @Override
    public String toString() {
        return "Medication{" +
                "id=" + id +
                ", medicationName='" + medicationName + '\'' +
                ", actualCost=" + actualCost +
                '}';
    }
}
