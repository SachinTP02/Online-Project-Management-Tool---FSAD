package com.fsad.opm.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectAttachmentResponse {
    private Long id;
    private String attachmentName;
    private String attachmentType;
    private String base64Data;
}