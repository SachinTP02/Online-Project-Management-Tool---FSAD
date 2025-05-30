package com.fsad.opm.repository;

import com.fsad.opm.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long> {
}
