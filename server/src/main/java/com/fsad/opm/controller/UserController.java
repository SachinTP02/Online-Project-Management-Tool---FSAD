package com.fsad.opm.controller;

import com.fsad.opm.model.User;
import com.fsad.opm.model.Status;
import com.fsad.opm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("")
    public ResponseEntity<List<UserDTO>> getAllAcceptedUsers() {
        List<User> users = userRepository.findByStatus(Status.ACCEPTED);
        List<UserDTO> dtos = users.stream()
                .map(u -> new UserDTO(u.getId(), u.getUsername(), u.getEmail()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    public static class UserDTO {
        public Long id;
        public String username;
        public String email;
        public UserDTO(Long id, String username, String email) {
            this.id = id;
            this.username = username;
            this.email = email;
        }
    }
}
