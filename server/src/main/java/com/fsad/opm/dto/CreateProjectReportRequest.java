package com.fsad.opm.dto;

import com.fsad.opm.model.ReportFrequency;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateProjectReportRequest {
    private String title;
    private String summary;
    private LocalDate reportDate;
    private Long projectId;
    private ReportFrequency frequency;
}
