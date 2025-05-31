package com.fsad.opm.controller;

import com.fsad.opm.model.Complaint;
import com.fsad.opm.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {
    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody ComplaintRequest request) {
        Complaint complaint = complaintService.createComplaint(request.getUsername(), request.getContent());
        return ResponseEntity.ok(complaint);
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Complaint>> getComplaintsByUser(@PathVariable String username) {
        return ResponseEntity.ok(complaintService.getComplaintsByUsername(username));
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<Complaint> replyAndClose(@PathVariable Long id, @RequestBody AdminReplyRequest request) {
        Complaint updated = complaintService.replyAndCloseComplaint(id, request.getAdminComment());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Complaint>> getComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaint(id));
    }

    // DTOs
    @lombok.Data
    public static class ComplaintRequest {
        private String username;
        private String content;
    }
    @lombok.Data
    public static class AdminReplyRequest {
        private String adminComment;
    }
}
