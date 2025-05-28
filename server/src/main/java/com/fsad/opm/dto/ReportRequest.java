package com.fsad.opm.dto;

import lombok.Data;

@Data
public class ReportRequest {
    Long projectId;
    String period;
    private String email;

}
