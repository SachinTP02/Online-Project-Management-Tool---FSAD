package com.fsad.opm.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateProjectRequest {
    private String name;
    private String description;
    private String ownername;
    private Long ownerId;
    private Long milestoneId;
    private LocalDate startDate;
    private LocalDate endDate;
}
