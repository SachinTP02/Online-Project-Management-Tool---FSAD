package com.fsad.opm.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class TaskRequest {
    private String name;
    private String description;
    private Long projectId;
    private Long milestoneId;
    private Set<Long> assignedUserIds;
}