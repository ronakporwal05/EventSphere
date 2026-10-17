package com.eventsphere.notification.provider;

public interface EmailProvider {

    String getProviderName();

    boolean sendEmail(String toEmail, String subject, String bodyContent);
}
