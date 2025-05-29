package com.fsad.opm.controller;

import com.fsad.opm.dto.CreateProjectReportRequest;
import com.fsad.opm.model.ProjectReport;
import com.fsad.opm.service.ProjectReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.fsad.opm.dto.ReportRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fsad.opm.dto.ReportResponse;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProjectReportController {

    private final ProjectReportService reportService;

    @PostMapping("/reports")
    public ResponseEntity<ReportResponse> getReports(@RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.getReportForProject(request.getProjectId(), request.getPeriod()));
    }

    @PostMapping("/reports/download")
    public ResponseEntity<byte[]> downloadReportPdf(@RequestBody ReportRequest request) {
        byte[] pdf = reportService.generateReportPdf(request.getProjectId(), request.getPeriod());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/reports/email")
    public ResponseEntity<String> emailReport(@RequestBody ReportRequest request) {
        reportService.emailReportPdf(request.getProjectId(), request.getPeriod(), request.getEmail());
        return ResponseEntity.ok("Report emailed successfully.");
}

}
