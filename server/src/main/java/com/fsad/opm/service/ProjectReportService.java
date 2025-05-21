package com.fsad.opm.service;

import com.fsad.opm.dto.CreateProjectReportRequest;
import com.fsad.opm.model.Project;
import com.fsad.opm.model.ProjectReport;
import com.fsad.opm.model.User;
import com.fsad.opm.repository.ProjectReportRepository;
import com.fsad.opm.repository.ProjectRepository;
import com.fsad.opm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectReportService {

    private final ProjectReportRepository reportRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;

    public ProjectReport createReport(CreateProjectReportRequest request, String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Project project = projectRepo.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectReport report = ProjectReport.builder()
                .title(request.getTitle())
                .summary(request.getSummary())
                .reportDate(request.getReportDate())
                .project(project)
                .createdBy(user)
                .frequency(request.getFrequency())
                .build();

        return reportRepo.save(report);
    }

    public List<ProjectReport> getReportsForProject(Long projectId) {

        return reportRepo.findByProjectId(projectId);

    }

    public byte[] generatePdf(ProjectReport report) throws IOException {
        String html = "<html><body><h1>" + report.getProjectName() + "</h1><p>" +
                report.getSummary() + "</p></body></html>";

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.useFastMode();
        builder.withHtmlContent(html, null);
        builder.toStream(out);
        builder.run();

        return out.toByteArray();
    }


}

