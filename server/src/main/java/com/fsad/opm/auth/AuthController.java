package com.fsad.opm.auth;

import com.fsad.opm.dto.AuthRequest;
import com.fsad.opm.dto.AuthResponse;
import com.fsad.opm.dto.RegisterRequest;
import com.fsad.opm.dto.StatusUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {

        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping("/pending-users")
    public ResponseEntity<?> getPendingUsers(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authService.getPendingUsers(token));
    }

    @PutMapping("/statusUpdate")
    public ResponseEntity<?> updateUserStatus(@RequestHeader("Authorization") String token,
                                              @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(authService.updateUserStatus(token, request));
    }

}
