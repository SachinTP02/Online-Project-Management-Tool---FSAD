package com.fsad.opm.service.impl;

import com.fsad.opm.dto.CreateProjectRequest;
import com.fsad.opm.dto.ProjectResponse;
import com.fsad.opm.model.Project;
import com.fsad.opm.model.User;
import com.fsad.opm.repository.ProjectRepository;
import com.fsad.opm.repository.UserRepository;
import com.fsad.opm.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public ProjectResponse createProject(CreateProjectRequest requestDTO) {

        userRepository.findByUsername(requestDTO.getOwnername())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Project project = Project.builder()
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .ownerUsername(requestDTO.getOwnername()) // store the username directly
                .build();

        Project savedProject = projectRepository.save(project);

        return ProjectResponse.builder()
                .id(savedProject.getId())
                .name(savedProject.getName())
                .description(savedProject.getDescription())
                .ownerUsername(savedProject.getOwnerUsername())
                .build();
    }
}
