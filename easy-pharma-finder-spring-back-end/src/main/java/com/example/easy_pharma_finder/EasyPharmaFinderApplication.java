package com.example.easy_pharma_finder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = { org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class })

public class EasyPharmaFinderApplication {
	public static void main(String[] args) {
		SpringApplication.run(EasyPharmaFinderApplication.class, args);
	}
}
