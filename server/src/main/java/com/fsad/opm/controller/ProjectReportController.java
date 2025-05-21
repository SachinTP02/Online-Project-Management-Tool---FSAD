package com.fsad.opm.controller;

import com.fsad.opm.dto.CreateProjectReportRequest;
import com.fsad.opm.model.ProjectReport;
import com.fsad.opm.service.ProjectReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ProjectReportController {

    private final ProjectReportService reportService;

    @PostMapping
    public ResponseEntity<ProjectReport> createReport(@RequestBody CreateProjectReportRequest request,
                                                      @AuthenticationPrincipal UserDetails user) {
        ProjectReport report = reportService.createReport(request, user.getUsername());
        return ResponseEntity.ok(report);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectReport>> getReports(@PathVariable Long projectId) {
        return ResponseEntity.ok(reportService.getReportsForProject(projectId));
    }

    @GetMapping("/{projectId}/pdf")
    public ResponseEntity<byte[]> getReportPdf(@PathVariable Long projectId) throws IOException {
        ProjectReport report = reportService.getReports("WEEKLY")
                .stream().filter(r -> r.getId().equals(projectId)).findFirst().orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        byte[] pdf = reportService.generatePdf(report);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

}
