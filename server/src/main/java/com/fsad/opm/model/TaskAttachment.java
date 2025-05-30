package com.fsad.opm.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "task_attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String attachmentName;
    private String attachmentType;

    @Lob
    private byte[] attachment;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
}
