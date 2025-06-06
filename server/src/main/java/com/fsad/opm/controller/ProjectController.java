package com.fsad.opm.controller;

import com.fsad.opm.dto.CreateProjectRequest;
import com.fsad.opm.dto.ProjectResponse;
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
            @RequestPart(value = "file", required = false) MultipartFile file) {

        ProjectResponse response = projectService.createProject(requestDTO, file);
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

    @GetMapping("/owned")
    public List<Project> getProjectsOwnedByUser(@RequestParam String username) {
        return projectService.getProjectsByOwnerUsername(username);
    }

    @GetMapping("/assigned-or-owned")
    public List<Project> getProjectsAssignedOrOwned(@RequestParam String username) {
        return projectService.getProjectsAssignedOrOwned(username);
    }

    @GetMapping("/{projectId}/attachment")
    public ResponseEntity<byte[]> getProjectAttachment(@PathVariable Long projectId) {
        return projectService.getProjectAttachment(projectId);
    }

}
