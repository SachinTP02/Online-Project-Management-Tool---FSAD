package com.fsad.opm.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // who raised
    private String content;
    private String status; // OPEN, CLOSED
    private String adminComment;
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;
}
