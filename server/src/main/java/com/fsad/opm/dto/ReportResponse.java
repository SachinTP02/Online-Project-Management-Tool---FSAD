package com.fsad.opm.dto;

import com.fsad.opm.model.Project;
import com.fsad.opm.model.Task;

import lombok.*;

import java.time.LocalDate;
import java.util.*;
import java.util.Set;

@Data
public class ReportResponse {
    private Project project;
    private LocalDate startDate;
    private List<Task> taskByPeriod;
    private HashMap<String,List<Task>> taskStatusMap;

}
