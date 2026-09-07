package com.scholarsync.service;

import com.scholarsync.dto.AuthResponse;
import com.scholarsync.dto.LoginRequest;
import com.scholarsync.dto.RegistrationRequest;

public interface AuthService {

    AuthResponse register(RegistrationRequest request);

    AuthResponse login(LoginRequest request);
}
