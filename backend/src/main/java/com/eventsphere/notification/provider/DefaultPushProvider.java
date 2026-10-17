package com.eventsphere.notification.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DefaultPushProvider implements PushProvider {

    @Override
    public String getProviderName() {
        return "DEFAULT_PUSH_MOCK";
    }

    @Override
    public boolean sendPushNotification(String recipientId, String title, String message) {
        log.info("[PUSH PROVIDER - {}] Dispatching push to '{}' | Title: '{}'", getProviderName(), recipientId, title);
        return true;
    }
}
