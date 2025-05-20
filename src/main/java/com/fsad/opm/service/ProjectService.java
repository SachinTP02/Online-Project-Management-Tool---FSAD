package com.fsad.opm.service;

import com.fsad.opm.dto.CreateProjectRequest;
import com.fsad.opm.dto.ProjectResponse;

public interface ProjectService {
    ProjectResponse createProject(CreateProjectRequest requestDTO);
}
