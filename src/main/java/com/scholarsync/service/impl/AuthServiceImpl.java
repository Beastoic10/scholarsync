package com.scholarsync.service.impl;

import com.scholarsync.domain.model.User;
import com.scholarsync.dto.AuthResponse;
import com.scholarsync.dto.LoginRequest;
import com.scholarsync.dto.RegistrationRequest;
import com.scholarsync.dto.UserResponse;
import com.scholarsync.security.JwtService;
import com.scholarsync.service.AuthService;
import com.scholarsync.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(
            UserService userService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponse register(RegistrationRequest request) {
        User user = userService.register(request);
        return AuthResponse.bearer(jwtService.generateToken(user), UserResponse.from(user));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        User user = userService.findByEmail(email);
        return AuthResponse.bearer(jwtService.generateToken(user), UserResponse.from(user));
    }
}
