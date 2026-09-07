package com.scholarsync.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Endpoint 3: Home Page (GET /api/home) - protected, requires a valid JWT.
 * Also exposes a public health check used by PUBLIC_ENDPOINTS in SecurityConfig.
 */
@RestController
@RequestMapping("/api")
@Tag(name = "Home", description = "Authenticated landing page + health check")
public class HomeController {

    @GetMapping("/health")
    @Operation(summary = "Public health check, no auth required")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "ScholarSync",
                "timestamp", Instant.now().toString()
        ));
    }

    @GetMapping("/home")
    @Operation(summary = "Authenticated home/dashboard endpoint")
    public ResponseEntity<Map<String, Object>> home(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "message", "Welcome to ScholarSync, " + authentication.getName(),
                "roles", authentication.getAuthorities(),
                "timestamp", Instant.now().toString()
        ));
    }
}
