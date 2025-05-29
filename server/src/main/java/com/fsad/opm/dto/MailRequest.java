package com.fsad.opm.dto;

import lombok.Data;

@Data
public class MailRequest {
    private String to;
    private String subject;
    private String content;
   
}
