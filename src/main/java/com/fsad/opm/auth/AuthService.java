package com.fsad.opm.auth;

import com.fsad.opm.config.JwtService;
import com.fsad.opm.dto.AuthRequest;
import com.fsad.opm.dto.AuthResponse;
import com.fsad.opm.dto.RegisterRequest;
import com.fsad.opm.model.Role;
import com.fsad.opm.model.User;
import com.fsad.opm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.fsad.opm.model.Status.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status(PENDING)
                .build();
        userRepository.save(user);

        String jwt = jwtService.generateToken(user);
        return new AuthResponse(jwt);
    }

    public AuthResponse authenticate(AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isEmpty()) {
            throw new RuntimeException("User not found");
        }
        if (userRepository.findByUsername(request.getUsername()).get().getStatus() != ACCEPTED) {
            throw new RuntimeException("User is not authenticated by Admin");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String jwt = jwtService.generateToken(user);
        return new AuthResponse(jwt);
    }
}
