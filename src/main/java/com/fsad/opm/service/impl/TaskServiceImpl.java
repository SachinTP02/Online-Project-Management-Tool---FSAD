package com.fsad.opm.service.impl;

import com.fsad.opm.dto.TaskRequest;
import com.fsad.opm.model.Milestone;
import com.fsad.opm.model.Task;
import com.fsad.opm.model.User;
import com.fsad.opm.repository.MilestoneRepository;
import com.fsad.opm.repository.TaskRepository;
import com.fsad.opm.repository.UserRepository;
import com.fsad.opm.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;

    @Override
    public Task createTask(TaskRequest request) {
        Milestone milestone = milestoneRepository.findById(request.getMilestoneId())
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        User user = userRepository.findById(request.getAssignedUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = Task.builder()
                .name(request.getName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .milestone(milestone)
                .assignedTo(user)
                .build();

        return taskRepository.save(task);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}
