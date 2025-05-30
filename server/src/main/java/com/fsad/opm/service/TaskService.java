package com.fsad.opm.service;

import com.fsad.opm.dto.ProjectAttachmentResponse;
import com.fsad.opm.dto.TaskAttachmentResponse;
import com.fsad.opm.dto.TaskRequest;
import com.fsad.opm.model.Task;
import com.fsad.opm.model.TaskStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

public interface TaskService
{
    Task createTask(TaskRequest request, List<MultipartFile> files);
    List<Task> getTasksByProjectId(Long projectId);
    List<Task> getTasksByMilestoneId(Long milestoneId);
    List<Task> getAllTasks();
    Task updateAssignedUsers(Long taskId, Set<Long> assignedUserIds);
    Task updateStatus(Long taskId, TaskStatus status);
    Task removeAssignedUsers(Long taskId, Set<Long> assignedUserIds);
    List<TaskAttachmentResponse> getAttachmentsByTaskId(Long taskId);
    void addAttachmentsToTask(Long taskId, List<MultipartFile> files);
}