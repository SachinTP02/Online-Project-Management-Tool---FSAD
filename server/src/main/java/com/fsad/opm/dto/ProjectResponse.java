package com.fsad.opm.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;


@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String ownerUsername;
    private Long ownerId;
    private Long milestoneId;
    private LocalDate startDate;
    private LocalDate endDate;
}
