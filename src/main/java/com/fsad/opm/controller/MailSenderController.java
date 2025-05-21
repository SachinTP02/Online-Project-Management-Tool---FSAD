package com.fsad.opm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MailSenderController {
//    @Autowired
//    MailSender

    @PostMapping()
    public String sendMail(@RequestParam("to") String to){
        return "hello";
    }
}
