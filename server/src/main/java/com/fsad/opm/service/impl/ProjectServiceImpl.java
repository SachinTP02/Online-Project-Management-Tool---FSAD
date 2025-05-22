package com.fsad.opm.service.impl;

import com.fsad.opm.dto.CreateProjectRequest;
import com.fsad.opm.dto.ProjectResponse;
import com.fsad.opm.model.Milestone;
import com.fsad.opm.model.Project;
import com.fsad.opm.model.Task;
import com.fsad.opm.model.User;
import com.fsad.opm.repository.MilestoneRepository;
import com.fsad.opm.repository.ProjectRepository;
import com.fsad.opm.repository.UserRepository;
import com.fsad.opm.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.fsad.opm.model.Status.ACCEPTED;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MilestoneRepository milestoneRepository;

    @Override
    public ProjectResponse createProject(CreateProjectRequest requestDTO) {

        // Check if the user is authenticated
        userRepository.findByUsername(requestDTO.getOwnername())
                .ifPresent(user -> {
                    if (user.getStatus() != ACCEPTED) {
                        throw new RuntimeException("User is not authenticated by Admin");
                    }
                });

        Long milestoneId = requestDTO.getMilestoneId();
        Milestone milestone = null;
        if (milestoneId != null) {
            milestone = milestoneRepository.findById(milestoneId).orElse(null);
        }

        Project project = Project.builder()
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .ownerUsername(requestDTO.getOwnername()) // store the username directly
                .ownerId(requestDTO.getOwnerId())
                .milestoneId(milestoneId)
                .startDate(milestone != null ? milestone.getStartDate() : requestDTO.getStartDate())
                .endDate(milestone != null ? milestone.getEndDate() : requestDTO.getEndDate())
                .build();

        Project savedProject = projectRepository.save(project);

        return ProjectResponse.builder()
                .id(savedProject.getId())
                .name(savedProject.getName())
                .description(savedProject.getDescription())
                .ownerUsername(savedProject.getOwnerUsername())
                .build();
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}
