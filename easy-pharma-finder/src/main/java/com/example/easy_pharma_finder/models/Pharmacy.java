package com.example.easy_pharma_finder.models;

import jakarta.persistence.*;

@Entity
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String pharmacyName;
    private String Address;
    private String city;
    private String State;
    private String Country;
    private String zipCode;

    public Pharmacy() {
    }

    public Pharmacy(int id, String pharmacyName, String address, String city, String state, String country, String zipCode) {
        this.id = id;
        this.pharmacyName = pharmacyName;
        Address = address;
        this.city = city;
        State = state;
        Country = country;
        this.zipCode = zipCode;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPharmacyName() {
        return pharmacyName;
    }

    public void setPharmacyName(String pharmacyName) {
        this.pharmacyName = pharmacyName;
    }

    public String getAddress() {
        return Address;
    }

    public void setAddress(String address) {
        Address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return State;
    }

    public void setState(String state) {
        State = state;
    }

    public String getCountry() {
        return Country;
    }

    public void setCountry(String country) {
        Country = country;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
}
