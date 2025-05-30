package com.fsad.opm.controller;

import com.fsad.opm.dto.TaskRequest;
import com.fsad.opm.model.Task;
import com.fsad.opm.model.TaskStatus;
import com.fsad.opm.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Task createTask(
            @RequestPart("data") TaskRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        return taskService.createTask(request, files);
    }


    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProjectId(projectId);
    }

    @GetMapping("/milestone/{milestoneId}")
    public List<Task> getTasksByMilestone(@PathVariable Long milestoneId) {
        return taskService.getTasksByMilestoneId(milestoneId);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PutMapping("/{taskId}/assign-users")
    public ResponseEntity<Task> assignUsers(
            @PathVariable Long taskId,
            @RequestBody Set<Long> userIds) {
        return ResponseEntity.ok(taskService.updateAssignedUsers(taskId, userIds));
    }

    @PutMapping("/{taskId}/remove-users")
    public void removeUsers(
            @PathVariable Long taskId,
            @RequestBody Set<Long> userIds)
    {
       taskService.removeAssignedUsers(taskId, userIds);
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateStatus(
            @PathVariable Long taskId,
            @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateStatus(taskId, status));
    }

}
