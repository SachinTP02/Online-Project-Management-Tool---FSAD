package com.fsad.opm.repository;

import com.fsad.opm.model.ProjectReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectReportRepository extends JpaRepository<ProjectReport, Long> {
    List<ProjectReport> findByProjectId(Long projectId);
    List<ProjectReport> findByProjectIdAndReportDateBetween(Long projectId, LocalDate from, LocalDate to);
}
