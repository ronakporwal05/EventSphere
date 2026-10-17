package com.eventsphere.notification.provider;

public interface PushProvider {

    String getProviderName();

    boolean sendPushNotification(String recipientId, String title, String message);
}
