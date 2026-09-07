package com.scholarsync.dto;

import com.scholarsync.domain.enums.Role;
import com.scholarsync.domain.model.User;

public record UserResponse(Long id, String email, String fullName, Role role, String institution) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getInstitution());
    }
}
