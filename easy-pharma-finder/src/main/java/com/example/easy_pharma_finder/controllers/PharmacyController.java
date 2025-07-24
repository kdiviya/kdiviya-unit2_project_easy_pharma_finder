package com.example.easy_pharma_finder.controllers;


import com.example.easy_pharma_finder.repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class PharmacyController {

    private UserRepository user;



}
