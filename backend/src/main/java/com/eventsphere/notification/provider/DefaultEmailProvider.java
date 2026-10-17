package com.eventsphere.notification.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DefaultEmailProvider implements EmailProvider {

    @Override
    public String getProviderName() {
        return "DEFAULT_SMTP_MOCK";
    }

    @Override
    public boolean sendEmail(String toEmail, String subject, String bodyContent) {
        log.info("[EMAIL PROVIDER - {}] Dispatching email to '{}' | Subject: '{}'", getProviderName(), toEmail, subject);
        // Simulated successful dispatch
        return true;
    }
}
