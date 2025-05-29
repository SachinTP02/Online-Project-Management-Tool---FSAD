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
 import com.fsad.opm.service.ReportPdfService;
 import lombok.RequiredArgsConstructor;
 import org.springframework.http.ResponseEntity;
 import org.springframework.security.core.userdetails.UsernameNotFoundException;
 import org.springframework.stereotype.Service;
 import com.fsad.opm.dto.ReportResponse;
 //import org.springframework.mail.javamail.JavaMailSender;
 import jakarta.mail.MessagingException;
 import jakarta.mail.internet.MimeMessage;
 import org.springframework.mail.javamail.MimeMessageHelper;
 import org.springframework.core.io.ByteArrayResource;
 import java.time.LocalDate;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;

 @Service
 @RequiredArgsConstructor
public class ProjectReportService {

     private final EmailService emailService;
     private final ProjectReportRepository reportRepo;
     private final ProjectRepository projectRepo;
     private final UserRepository userRepo;
     private final ProjectService projectService;
     private final TaskService taskService;
     private final ReportPdfService reportPdfService;
    
     public ReportResponse getReportForProject(Long projectId, String period) {

         ReportResponse response = new ReportResponse();

         LocalDate now = LocalDate.now();
         LocalDate fromDate = switch (period.toLowerCase()) {
             case "weekly" -> now.minusWeeks(1);
             case "monthly" -> now.minusMonths(1);
             default -> now.minusYears(10); // fallback: all
         };
         response.setStartDate(fromDate);

         Project project=projectService.getProjectById(projectId);
         if(project!=null){
            response.setProject(project);
         }
         response.setProject(project);

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

    public byte[] generateReportPdf(Long projectId, String period) {
        ReportResponse report = getReportForProject(projectId, period);
        return reportPdfService.generatePdfFromReport(report);
    }

    public void emailReportPdf(Long projectId, String period, String email) {
    byte[] pdf = generateReportPdf(projectId, period);
    String subject = "Project Report - " + period.toUpperCase();
    String body = "Please find the attached project report for the selected period.";
    emailService.sendWithAttachment(email, subject, body, pdf, "report.pdf");
}

 }

