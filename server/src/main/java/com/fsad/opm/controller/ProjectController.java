package com.fsad.opm.controller;

import com.fsad.opm.dto.CreateProjectRequest;
import com.fsad.opm.dto.ProjectResponse;
import com.fsad.opm.dto.ProjectAttachmentResponse;
import com.fsad.opm.model.Project;
import com.fsad.opm.model.Task;
import com.fsad.opm.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponse> createProject(
            @RequestPart("data") CreateProjectRequest requestDTO,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        ProjectResponse response = projectService.createProject(requestDTO, files);
        return ResponseEntity.ok(response);
    }


    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        if (project != null) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{projectId}/attachments")
    public ResponseEntity<List<ProjectAttachmentResponse>> getAttachmentsByProjectId(@PathVariable Long projectId) {
        List<ProjectAttachmentResponse> attachments = projectService.getAttachmentsByProjectId(projectId);
        return ResponseEntity.ok(attachments);
    }
}
