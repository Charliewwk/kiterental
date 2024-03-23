package com.hhr.backend.service;

import com.hhr.backend.service.user.UserService;
import org.apache.log4j.Logger;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(UserService.class);

    public void sendWelcomeEmail(String recipientName, String recipientEmail, String activationLink) {
        final String username = "hihatrental@gmail.com";
        final String password = "fnni jgec rkzn iviq";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
            message.setSubject("¡Bienvenido a hitHat Rental!");

            String htmlBody = loadHtmlFromResource("/static/welcome_email_template.html");

            htmlBody = htmlBody.replace("{{recipient_name}}", recipientName);
            htmlBody = htmlBody.replace("{{activation_link}}", activationLink);

            message.setContent(htmlBody, "text/html; charset=utf-8");

            logger.info("sendWelcomeEmail method: Sending to " + recipientEmail);
            Transport.send(message);
            logger.info("sendWelcomeEmail method: Successfully sent.");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    private String loadHtmlFromResource(String resourceName) {
        try {
            Resource resource = new ClassPathResource(resourceName);
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Error loading HTML resource: " + resourceName, e);
        }
    }
}
