package com.fsad.opm.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MilestoneRequest {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
}
