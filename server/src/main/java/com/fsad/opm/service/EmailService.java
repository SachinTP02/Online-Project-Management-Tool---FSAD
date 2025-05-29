package com.fsad.opm.service;

import java.util.Properties;

import org.springframework.stereotype.Service;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    //private final ProjectReportService projectReportService;

    

    public void send(String toEmail,String sub, String text) {

        String to = toEmail;
        String from = "taskforge.projectplanning@gmail.com";
        String host = "smtp.gmail.com";
        String subject=sub;
        String content=text;

        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "465");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.socketFactory.fallback", "false");
        props.put("mail.smtp.connectiontimeout", "10000");  // 10 seconds
        props.put("mail.smtp.timeout", "10000");            // 10 seconds
        props.put("mail.smtp.writetimeout", "10000");

        Session session = Session.getInstance(props,
            new jakarta.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(from, "hxkw ntcp dhot ftmt");
                }
            });

        System.out.println(session);

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(content);
            Transport.send(message);
            System.out.println("Sent successfully.");
        } 
        catch (MessagingException e) {
            e.printStackTrace();
        }   
         }

    //     public void emailReportPdf(Long projectId, String period, String toEmail) {
    //     byte[] pdf = projectReportService.generateReportPdf(projectId, period); // You must implement this

    //     Session session = createSession();

    //     try {
    //         String to = toEmail;
    //         String from = "taskforge.projectplanning@gmail.com";
    //         String host = "smtp.gmail.com";
    //         MimeMessage message = new MimeMessage(session);
    //         message.setFrom(new InternetAddress(from));
    //         message.setRecipients(
    //             Message.RecipientType.TO, InternetAddress.parse(toEmail));
    //         message.setSubject("Project Report");

    //         // Create multipart content
    //         Multipart multipart = new MimeMultipart();

    //         // Body part
    //         MimeBodyPart textPart = new MimeBodyPart();
    //         textPart.setText("Please find the attached project report.");
    //         multipart.addBodyPart(textPart);

    //         // Attachment part
    //         MimeBodyPart attachmentPart = new MimeBodyPart();
    //         attachmentPart.setFileName("report.pdf");
    //         attachmentPart.setContent(pdf, "application/pdf");
    //         multipart.addBodyPart(attachmentPart);

    //         // Set content
    //         message.setContent(multipart);

    //         // Send
    //         Transport.send(message);
    //         System.out.println("PDF report sent successfully.");
    //     } catch (MessagingException e) {
    //         throw new RuntimeException("Failed to send email with PDF", e);
    //     }
    // }

}
