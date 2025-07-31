package com.example.easy_pharma_finder.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class FamilyMember {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    private String name;
    private LocalDate dob;
    private String relationship;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    @ManyToMany
    @JoinTable(
            name = "family_member_medication",
            joinColumns = @JoinColumn(name="family_member_id"),
            inverseJoinColumns = @JoinColumn(name="medication_id")
    )
    private List<Medication> medications = new ArrayList<>();

    public FamilyMember() {}

    public FamilyMember(int id, String name, LocalDate dob, String relationship, User user) {
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.relationship = relationship;
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Medication> getMedications() {
        return medications;
    }

    public void setMedications(List<Medication> medications) {
        this.medications = medications;
    }

    @Override
    public String toString() {
        return "FamilyMember{Id=" + id +

                ", name='" + name + '\'' +
                ", dob=" + dob +
                ", relationship='" + relationship + '\'' +
                ", user=" + (user != null ? user.getUserName() : "null") +
                '}';
    }
}

