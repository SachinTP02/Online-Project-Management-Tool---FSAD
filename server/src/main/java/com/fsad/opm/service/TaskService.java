package com.fsad.opm.service;

import com.fsad.opm.dto.TaskRequest;
import com.fsad.opm.model.Task;

import java.util.List;

public interface TaskService {
    Task createTask(TaskRequest request);
    List<Task> getAllTasks();
}
