package com.example.backend.service;

import com.example.backend.entity.Product;
import com.example.backend.entity.Rent;
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
        final String password = "fevk pzpl gstm psbi";

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
            message.setSubject("¡Bienvenido a KiteRental Tofo!");

            String htmlBody = loadHtmlFromResource("/welcome_email.html");

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

    public void sendRentConfirmationEmail(String userName, String recipientEmail, String rentLink, Product product, Rent rent) {
        final String username = "rominamazzuco@gmail.com";
        final String password = "tovs iyqy yzzf ayjc";

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
            message.setSubject("¡Reserva exitosa!");

            String htmlBody = loadHtmlFromResource("/rent_email.html");

            htmlBody = htmlBody.replace("{{user_name}}", userName);
            htmlBody = htmlBody.replace("{{product_name}}", product.getName());
            htmlBody = htmlBody.replace("{{product_description}}", product.getDescription());
            htmlBody = htmlBody.replace("{{rents_link}}", rentLink);
            htmlBody = htmlBody.replace("{{product_price}}", rent.getTotalPrice().toString());
            htmlBody = htmlBody.replace("{{start_date}}", rent.getStartDate().toString());
            htmlBody = htmlBody.replace("{{end_date}}", rent.getEndDate().toString());

            message.setContent(htmlBody, "text/html; charset=utf-8");

            logger.info("sendRentConfirmationEmail method: Sending to " + recipientEmail);
            Transport.send(message);
            logger.info("sendRentConfirmationEmail method: Successfully sent.");

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
