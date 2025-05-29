package com.fsad.opm.service.impl;

import com.fsad.opm.dto.CreateProjectRequest;
import com.fsad.opm.dto.ProjectResponse;
import com.fsad.opm.dto.ProjectAttachmentResponse;
import com.fsad.opm.model.*;
import com.fsad.opm.repository.MilestoneRepository;
import com.fsad.opm.repository.ProjectRepository;
import com.fsad.opm.repository.UserRepository;
import com.fsad.opm.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
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
    public ProjectResponse createProject(CreateProjectRequest requestDTO, List<MultipartFile> files) {

        // Validate user
        userRepository.findByUsername(requestDTO.getOwnername())
                .ifPresent(user -> {
                    if (user.getStatus() != ACCEPTED) {
                        throw new RuntimeException("User is not authenticated by Admin");
                    }
                });

        Long milestoneId = requestDTO.getMilestoneId();
        Milestone milestone = milestoneId != null ? milestoneRepository.findById(milestoneId).orElse(null) : null;

        Project project = Project.builder()
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .ownerUsername(requestDTO.getOwnername())
                .startDate(milestone != null ? milestone.getStartDate() : requestDTO.getStartDate())
                .endDate(milestone != null ? milestone.getEndDate() : requestDTO.getEndDate())
                .targetDate(requestDTO.getTargetDate())
                .milestone(milestone)
                .build();

        if (files != null && !files.isEmpty()) {
            List<ProjectAttachment> attachments = files.stream()
                    .map(file -> {
                        try {
                            return ProjectAttachment.builder()
                                    .attachment(file.getBytes())
                                    .attachmentName(file.getOriginalFilename())
                                    .attachmentType(file.getContentType())
                                    .project(project)
                                    .build();
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to process file", e);
                        }
                    })
                    .toList();
            project.setAttachments(attachments);
        }

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

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    @Override
    public List<ProjectAttachmentResponse> getAttachmentsByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return project.getAttachments().stream()
                .map(attachment -> ProjectAttachmentResponse.builder()
                        .id(attachment.getId())
                        .attachmentName(attachment.getAttachmentName())
                        .attachmentType(attachment.getAttachmentType())
                        .base64Data(Base64.getEncoder().encodeToString(attachment.getAttachment()))
                        .build())
                .toList();
    }

}
