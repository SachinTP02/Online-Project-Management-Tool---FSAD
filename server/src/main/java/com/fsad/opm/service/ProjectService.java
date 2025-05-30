package com.fsad.opm.service;

import com.fsad.opm.dto.CreateProjectRequest;
import com.fsad.opm.dto.ProjectAttachmentResponse;
import com.fsad.opm.dto.ProjectResponse;
import com.fsad.opm.model.Project;
import com.fsad.opm.model.Task;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {
    ProjectResponse createProject(CreateProjectRequest requestDTO, List<MultipartFile> files);
    List<Project> getAllProjects();
    Project getProjectById(Long id);
    List<ProjectAttachmentResponse> getAttachmentsByProjectId(Long projectId);
}
