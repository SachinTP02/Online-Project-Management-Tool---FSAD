 package com.fsad.opm.service;

 import com.fsad.opm.dto.CreateProjectReportRequest;
 import com.fsad.opm.model.Project;
 import com.fsad.opm.model.ProjectReport;
 import com.fsad.opm.model.User;
 import com.fsad.opm.repository.ProjectReportRepository;
 import com.fsad.opm.repository.ProjectRepository;
 import com.fsad.opm.repository.UserRepository;
 import com.fsad.opm.service.ProjectService;
 import com.fsad.opm.service.TaskService;
 import com. fsad. opm. model. Task;
 import com. fsad. opm. model. Milestone;

 import lombok.RequiredArgsConstructor;

 import org.springframework.http.ResponseEntity;
 import org.springframework.security.core.userdetails.UsernameNotFoundException;
 import org.springframework.stereotype.Service;

 import com.fsad.opm.dto.ReportResponse;

 import java.time.LocalDate;
 import java.util.ArrayList;
import java.util.HashMap;
 import java.util.List;

 @Service
 @RequiredArgsConstructor
public class ProjectReportService {

     private final ProjectReportRepository reportRepo;
     private final ProjectRepository projectRepo;
     private final UserRepository userRepo;
     private final ProjectService projectService;
     private final TaskService taskService;

// i want to provide report based on user choice-weekly or monthly
// it should include
// -->I want project info
// -->user assigned for project
// -->all task list in a table - taskname, assigned dev, status, desc for the selected time period


// give one more table-
// users
// all assigned task to user for selected time period
// status of above tasks

// bar charts to represent:for tasked of selcted period
// completed task,
// to do task,
// in progess task

// give one more chart between to be completed and completed for that period of time*/

     public ReportResponse getReportForProject(Long projectId, String period) {

         /*creating response object*/
         ReportResponse response = new ReportResponse();

         //updating  start date
         LocalDate now = LocalDate.now();
         LocalDate fromDate = switch (period.toLowerCase()) {
             case "weekly" -> now.minusWeeks(1);
             case "monthly" -> now.minusMonths(1);
             default -> now.minusYears(10); // fallback: all
         };
         response.setStartDate(fromDate);

         //update project details
         Project project=projectService.getProjectById(projectId);
         if(project!=null){
            response.setProject(project);
         }
         response.setProject(project);

         //update all task by projectId and for given period
         List<Task> tasks=taskFilterByPeriod(projectId,fromDate);
         response.setTaskByPeriod(tasks);

         HashMap<String,List<Task>> taskStatusMap=taskFilterByStatus(tasks);
         response.setTaskStatusMap(taskStatusMap);
         

         return response ;
     }

     private List<Task> taskFilterByPeriod(Long projectId, LocalDate fromDate) {
         List<Task> tasks = taskService.getTasksByProjectId(projectId);

         List<Task> list = new ArrayList<>();
         for (Task t : tasks) {
             if (t.getMilestone() != null &&
                     t.getMilestone().getStartDate() != null &&
                     t.getMilestone().getStartDate().isAfter(fromDate)) {
                 list.add(t);
             }
         }
         return list;
     }

     private HashMap<String, List<Task>> taskFilterByStatus(List<Task> tasks) {
        
        HashMap<String, List<Task>> statusMap = new HashMap<>();

         statusMap.put("TODO", new ArrayList<>());
         statusMap.put("IN_PROGRESS", new ArrayList<>());
         statusMap.put("DONE", new ArrayList<>());

        for (Task task : tasks) {
            if (task.getStatus() != null) {
                switch (task.getStatus()) {
                    case TODO -> statusMap.get("TODO").add(task);
                    case IN_PROGRESS -> statusMap.get("IN_PROGRESS").add(task);
                    case DONE -> statusMap.get("DONE").add(task);
            }
        }
    }

    return statusMap;
}

 }

