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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static com.fsad.opm.model.Status.ACCEPTED;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MilestoneRepository milestoneRepository;

    @Override
    public ProjectResponse createProject(CreateProjectRequest requestDTO, MultipartFile file) {

        // validate user
        userRepository.findByUsername(requestDTO.getOwnername())
                .ifPresent(user -> {
                    if (user.getStatus() != ACCEPTED) {
                        throw new RuntimeException("User is not authenticated by Admin");
                    }
                });

        Long milestoneId = requestDTO.getMilestoneId();
        Milestone milestone = milestoneId != null ? milestoneRepository.findById(milestoneId).orElse(null) : null;
        byte[] fileBytes = null;
        try {
            if (file != null) {
                fileBytes = file.getBytes();
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file bytes", e);
        }

        Project project = Project.builder()
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .ownerUsername(requestDTO.getOwnername())
                .startDate(milestone != null ? milestone.getStartDate() : requestDTO.getStartDate())
                .endDate(milestone != null ? milestone.getEndDate() : requestDTO.getEndDate())
                .targetDate(requestDTO.getTargetDate())
                .milestone(milestone)
                .attachment(fileBytes)
                .attachmentName(file != null ? file.getOriginalFilename() : null)
                .attachmentType(file != null ? file.getContentType() : null)
                .build();

        Project savedProject = projectRepository.save(project);

        return ProjectResponse.builder()
                .id(savedProject.getId())
                .name(savedProject.getName())
                .description(savedProject.getDescription())
                .ownerUsername(savedProject.getOwnerUsername())
                .milestoneId(savedProject.getMilestone() != null ? savedProject.getMilestone().getId() : null)
                .startDate(savedProject.getStartDate())
                .endDate(savedProject.getEndDate())
                .build();
    }

    public byte[] downloadAttachment(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return project.getAttachment();
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }
}
