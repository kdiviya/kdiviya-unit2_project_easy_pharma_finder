package com.example.easy_pharma_finder.models;

import jakarta.persistence.*;

//create a table pharmacy with below fields.
@Entity
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String pharmacyName;
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private String url;
    private Boolean isHomeDelivery;

    public Pharmacy() {
    }

    public Pharmacy(int id, String pharmacyName, String address, String city, String state, String country, String zipCode, String url, Boolean isHomeDelivery) {
        this.id = id;
        this.pharmacyName = pharmacyName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipCode = zipCode;
        this.url = url;
        this.isHomeDelivery = isHomeDelivery;
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
        return address;
    }

    public void setAddress(String address) {
        address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        country = country;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getIsHomeDelivery() {
        return isHomeDelivery;
    }

    public void setIsHomeDelivery(Boolean isHomeDelivery) {
        this.isHomeDelivery = isHomeDelivery;
    }

    @Override
    public String toString() {
        return "Pharmacy{" +
                "id=" + id +
                ", pharmacyName='" + pharmacyName + '\'' +
                ", Address='" + address + '\'' +
                ", city='" + city + '\'' +
                ", State='" + state + '\'' +
                ", Country='" + country + '\'' +
                ", zipCode='" + zipCode + '\'' +
                ", URL='" + url + '\'' +
                ", HomeDelivery='" + isHomeDelivery + '\'' +
                '}';
    }
}
