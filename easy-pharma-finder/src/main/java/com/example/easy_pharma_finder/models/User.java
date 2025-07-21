package com.example.easy_pharma_finder.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;


@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String firstName;
    private String middleName;
    private String lastName;

    @Column(nullable = false, unique = true)
    private String userName;

    private LocalDate dob;

    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String contactNo;
    private LocalDate lastVisitedDate;

    private String street;
    private String country;
    private String city;
    private String state;
    private String zipCode;

    private String insuranceProvider;
    private String insuranceType;
    private String insuranceNumber;

    private Boolean isFamilyMember;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<FamilyMember> familyMembers;

    public User(int id, String firstName, String middleName, String lastName, String userName, LocalDate dob, String password, String email, String contactNo, LocalDate lastVisitedDate, String street, String country, String city, String state, String zipCode, String insuranceProvider, String insuranceType, String insuranceNumber, Boolean isFamilyMember) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.userName = userName;
        this.dob = dob;
        this.password = password;
        this.email = email;
        this.contactNo = contactNo;
        this.lastVisitedDate = lastVisitedDate;
        this.street = street;
        this.country = country;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.insuranceProvider = insuranceProvider;
        this.insuranceType = insuranceType;
        this.insuranceNumber = insuranceNumber;
        this.isFamilyMember = isFamilyMember;
    }

    public User() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public LocalDate getLastVisitedDate() {
        return lastVisitedDate;
    }

    public void setLastVisitedDate(LocalDate lastVisitedDate) {
        this.lastVisitedDate = lastVisitedDate;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
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
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getInsuranceProvider() {
        return insuranceProvider;
    }

    public void setInsuranceProvider(String insuranceProvider) {
        this.insuranceProvider = insuranceProvider;
    }

    public String getInsuranceType() {
        return insuranceType;
    }

    public void setInsuranceType(String insuranceType) {
        this.insuranceType = insuranceType;
    }

    public String getInsuranceNumber() {
        return insuranceNumber;
    }

    public void setInsuranceNumber(String insuranceNumber) {
        this.insuranceNumber = insuranceNumber;
    }

    public List<FamilyMember> getFamilyMembers() {
        return familyMembers;
    }

    public void setFamilyMembers(List<FamilyMember> familyMembers) {
        this.familyMembers = familyMembers;
    }

    public Boolean getIsFamilyMember() {
        return isFamilyMember;
    }

    public void setIsFamilyMember(Boolean familyMember) {
        isFamilyMember = familyMember;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", middleName='" + middleName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", userName='" + userName + '\'' +
                ", dob=" + dob +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", contactNo='" + contactNo + '\'' +
                ", lastVisitedDate=" + lastVisitedDate +
                ", street='" + street + '\'' +
                ", country='" + country + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", zipCode='" + zipCode + '\'' +
                ", insuranceProvider='" + insuranceProvider + '\'' +
                ", insuranceType='" + insuranceType + '\'' +
                ", insuranceNumber='" + insuranceNumber + '\'' +
                ", isFamilyMember=" + isFamilyMember +
                ", familyMembers=" + familyMembers +
                '}';
    }
}
