package com.fsad.opm.service;

import com.fsad.opm.dto.TaskRequest;
import com.fsad.opm.model.Task;
import com.fsad.opm.model.TaskStatus;

import java.util.List;
import java.util.Set;

public interface TaskService
{
    Task createTask(TaskRequest request);
    List<Task> getTasksByProjectId(Long projectId);
    List<Task> getTasksByMilestoneId(Long milestoneId);
    Task updateAssignedUsers(Long taskId, Set<Long> assignedUserIds);
    Task updateStatus(Long taskId, TaskStatus status);
    Task removeAssignedUsers(Long taskId, Set<Long> assignedUserIds);
}
