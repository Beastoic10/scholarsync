package com.scholarsync.service;

import com.scholarsync.domain.model.User;
import com.scholarsync.dto.RegistrationRequest;

public interface UserService {

    User register(RegistrationRequest request);

    User findByEmail(String email);
}
