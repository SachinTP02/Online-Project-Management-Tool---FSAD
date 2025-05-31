package com.fsad.opm.service;

import com.fsad.opm.model.Complaint;
import com.fsad.opm.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ComplaintService {
    private final ComplaintRepository complaintRepository;

    public Complaint createComplaint(String username, String content) {
        Complaint complaint = Complaint.builder()
                .username(username)
                .content(content)
                .status("OPEN")
                .createdAt(LocalDateTime.now())
                .build();
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByUsername(String username) {
        return complaintRepository.findByUsername(username);
    }

    public Optional<Complaint> getComplaint(Long id) {
        return complaintRepository.findById(id);
    }

    public Complaint replyAndCloseComplaint(Long id, String adminComment) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        complaint.setAdminComment(adminComment);
        complaint.setStatus("CLOSED");
        complaint.setClosedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }
}
