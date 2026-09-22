package com.eventsphere.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailVerificationService {

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String toEmail, String verificationToken) {
        try {
            log.info("Sending verification email to: {}", toEmail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("EventSphere AI — Verify Your Email");
            message.setText("Welcome to EventSphere AI! Please verify your email using token: " + verificationToken);
            if (mailSender != null) {
                mailSender.send(message);
            } else {
                log.info("Simulated email verification sent to {}: token={}", toEmail, verificationToken);
            }
        } catch (Exception e) {
            log.error("Failed to send verification email to {}", toEmail, e);
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String otp) {
        try {
            log.info("Sending password reset email to: {}", toEmail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("EventSphere AI — Password Reset Request");
            message.setText("Your OTP for password reset is: " + otp);
            if (mailSender != null) {
                mailSender.send(message);
            } else {
                log.info("Simulated password reset OTP sent to {}: otp={}", toEmail, otp);
            }
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}", toEmail, e);
        }
    }
}
