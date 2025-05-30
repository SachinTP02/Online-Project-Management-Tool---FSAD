package com.fsad.opm.service.impl;

import com.fsad.opm.dto.ProjectAttachmentResponse;
import com.fsad.opm.dto.TaskAttachmentResponse;
import com.fsad.opm.dto.TaskRequest;
import com.fsad.opm.model.*;
import com.fsad.opm.repository.MilestoneRepository;
import com.fsad.opm.repository.ProjectRepository;
import com.fsad.opm.repository.TaskRepository;
import com.fsad.opm.repository.UserRepository;
import com.fsad.opm.service.TaskService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fsad.opm.service.EmailService;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final EmailService emailService;

    @Override
    public Task createTask(TaskRequest request, List<MultipartFile> files) {
        Milestone milestone = milestoneRepository.findById(request.getMilestoneId())
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Set<User> users = new HashSet<>(userRepository.findAllById(request.getAssignedUserIds()));
        if (users.size() != request.getAssignedUserIds().size()) {
            throw new RuntimeException("One or more users not found");
        }
        if (users.isEmpty()) {
            throw new RuntimeException("At least one user must be assigned to the task");
        }

        // Notify assigned users
        for (User user : users) {
            String content = user.getUsername() + ", you are assigned with a new task. Please check in the OPM application.";
            emailService.send(user.getEmail(), "Task Assigned", content);
        }

        // Create the task object
        Task task = Task.builder()
                .name(request.getName())
                .description(request.getDescription())
                .project(project)
                .milestone(milestone)
                .assignedUsers(users)
                .status(TaskStatus.TODO)
                .build();

        // Process file attachments if provided
        if (files != null && !files.isEmpty()) {
            List<TaskAttachment> attachments = files.stream().map(file -> {
                try {
                    return TaskAttachment.builder()
                            .attachment(file.getBytes())
                            .attachmentName(file.getOriginalFilename())
                            .attachmentType(file.getContentType())
                            .task(task) // Associate with task
                            .build();
                } catch (IOException e) {
                    throw new RuntimeException("Failed to process file", e);
                }
            }).toList();
            task.setAttachments(attachments);
        }

        return taskRepository.save(task);
    }


    @Override
    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public List<Task> getTasksByMilestoneId(Long milestoneId) {
        return taskRepository.findByMilestoneId(milestoneId);
    }

    @Override
    public Task updateAssignedUsers(Long taskId, Set<Long> assignedUserIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Set<User> users = new HashSet<>(userRepository.findAllById(assignedUserIds));
        task.getAssignedUsers().addAll(users);
        return taskRepository.save(task);
    }

    @Override
    public Task updateStatus(Long taskId, TaskStatus status) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(status);
        return taskRepository.save(task);    }

    @Override
    public Task removeAssignedUsers(Long taskId, Set<Long> assignedUserIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if(task.getAssignedUsers().isEmpty())
        {
          throw new RuntimeException("No users assigned to the task");
        }
        task.getAssignedUsers().removeIf(user -> assignedUserIds.contains(user.getId()));
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public List<TaskAttachmentResponse> getAttachmentsByTaskId(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return task.getAttachments().stream()
                .map(attachment -> TaskAttachmentResponse.builder()
                        .id(attachment.getId())
                        .attachmentName(attachment.getAttachmentName())
                        .attachmentType(attachment.getAttachmentType())
                        .base64Data(Base64.getEncoder().encodeToString(attachment.getAttachment()))
                        .build())
                .toList();
    }

}