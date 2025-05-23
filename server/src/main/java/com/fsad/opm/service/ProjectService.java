package com.fsad.opm.service;

import com.fsad.opm.dto.CreateProjectRequest;
import com.fsad.opm.dto.ProjectResponse;
import com.fsad.opm.model.Project;
import com.fsad.opm.model.Task;

import java.util.List;

public interface ProjectService {
    ProjectResponse createProject(CreateProjectRequest requestDTO);
    List<Project> getAllProjects();
    Project getProjectById(Long id);
}
