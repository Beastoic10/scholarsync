package com.scholarsync.controller.api;

import com.scholarsync.dto.UserResponse;
import com.scholarsync.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Authenticated user profile")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Return the profile of the authenticated user")
    public ResponseEntity<UserResponse> currentUser(Principal principal) {
        return ResponseEntity.ok(UserResponse.from(userService.findByEmail(principal.getName())));
    }
}
