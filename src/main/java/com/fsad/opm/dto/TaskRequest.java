package com.fsad.opm.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    private String name;
    private String description;
    private Long projectId;
    private Long milestoneId;
    private Long assignedUserId;
}