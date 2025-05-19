package com.fsad.opm.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MilestoneRequest {
    private String name;
    private String description;
    private LocalDate targetDate;
    private Long projectId;
}
