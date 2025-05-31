package com.fsad.opm.service.impl;

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
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
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

    public Task createTask(TaskRequest request, MultipartFile file) {
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

        for (User user : users) {
            String content = user.getUsername() + ", you are assigned with a new task. Please check in the OPM application.";
            emailService.send(user.getEmail(), "Task Assigned", content);
        }

        Task.TaskBuilder builder = Task.builder()
                .name(request.getName())
                .description(request.getDescription())
                .project(project)
                .milestone(milestone)
                .assignedUsers(users)
                .status(TaskStatus.TODO);

        // Process file
        if (file != null && !file.isEmpty()) {
            try {
                builder.attachment(file.getBytes());
                builder.attachmentName(file.getOriginalFilename());
                builder.attachmentType(file.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("Failed to process file", e);
            }
        }

        Task task = builder.build();
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
    public List<Task> getTaskByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(value -> taskRepository.findByAssignedUsers_Id(value.getId())).orElse(null);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

}
