package com.example.easy_pharma_finder.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
//Create custom security configuration based on my project requirements
public class SecurityConfig {

    //Secure the endpoints using HttpSecurity object
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
          httpSecurity
                .csrf(csrf -> csrf.disable())//disable cross-site request forgery for form based login
                .cors(Customizer.withDefaults()) //allow cors in other controllers
                  //specify the public  and authenticated endpoints
                .authorizeHttpRequests(auth -> auth
                                            .requestMatchers("/api/user/login", "/api/user/getSession", "/api/user/submit", "/api/user/checkUsername/**").permitAll()
                                            .requestMatchers("/api/user/**", "/api/user/pharmacy-details/**").authenticated()
                                        )
                  .sessionManagement(session -> session.maximumSessions(1)) //allows 1 session per user
                  //Save the security context (from Login controller) after user authentication.
                  .securityContext(securityContext -> securityContext.requireExplicitSave(false));


        return httpSecurity.build();
    }

    //Security Filter expects UserDetailsService even though I handled user authentication in Login Controller
    @Bean
    public UserDetailsService userDetailsService() {
        return new InMemoryUserDetailsManager();
    }
}

