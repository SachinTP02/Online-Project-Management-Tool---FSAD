package com.fsad.opm.service.impl;

import com.fsad.opm.dto.CreateProjectRequest;
import com.fsad.opm.dto.ProjectResponse;
import com.fsad.opm.model.*;
import com.fsad.opm.repository.MilestoneRepository;
import com.fsad.opm.repository.ProjectRepository;
import com.fsad.opm.repository.UserRepository;
import com.fsad.opm.repository.TaskRepository;
import com.fsad.opm.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.fsad.opm.model.Status.ACCEPTED;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MilestoneRepository milestoneRepository;
    private final TaskRepository taskRepository;

    @Override
    public ProjectResponse createProject(CreateProjectRequest requestDTO, MultipartFile file) {

        // Validate user
        userRepository.findByUsername(requestDTO.getOwnername())
                .ifPresent(user -> {
                    if (user.getStatus() != ACCEPTED) {
                        throw new RuntimeException("User is not authenticated by Admin");
                    }
                });

        Long milestoneId = requestDTO.getMilestoneId();
        Milestone milestone = milestoneId != null ? milestoneRepository.findById(milestoneId).orElse(null) : null;

        Project.ProjectBuilder builder = Project.builder()
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .ownerUsername(requestDTO.getOwnername())
                .startDate(milestone != null ? milestone.getStartDate() : requestDTO.getStartDate())
                .endDate(milestone != null ? milestone.getEndDate() : requestDTO.getEndDate())
                .targetDate(requestDTO.getTargetDate())
                .milestone(milestone);

        if (file != null && !file.isEmpty()) {
            try {
                builder.attachment(file.getBytes());
                builder.attachmentName(file.getOriginalFilename());
                builder.attachmentType(file.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("Failed to process file", e);
            }
        }

        Project project = builder.build();
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
    public List<Project> getProjectsByOwnerUsername(String username) {
        return projectRepository.findByOwnerUsername(username);
    }

    @Override
    public List<Project> getProjectsAssignedOrOwned(String username) {
        // Get projects where user is owner
        Set<Project> projects = new HashSet<>(projectRepository.findByOwnerUsername(username));
        // Get projects where user is assigned a task
        List<Task> assignedTasks = taskRepository.findByAssignedUsers_Username(username);
        for (Task t : assignedTasks) {
            if (t.getProject() != null) {
                projects.add(t.getProject());
            }
        }
        return List.copyOf(projects);
    }
    @Override
    public ResponseEntity<byte[]> getProjectAttachment(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (project.getAttachment() == null) {
            throw new RuntimeException("No attachment found for project with id: " + projectId);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(project.getAttachmentType()));
        headers.setContentDisposition(ContentDisposition
                .attachment()
                .filename(project.getAttachmentName())
                .build());

        return new ResponseEntity<>(project.getAttachment(), headers, HttpStatus.OK);
    }

}
