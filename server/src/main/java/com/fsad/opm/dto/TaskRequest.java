package com.fsad.opm.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long milestoneId;
    private Long assignedUserId;
}
// Compare this snippet from src/main/java/com/fsad/opm/service/TaskService.java: