package com.eventsphere.assistant.repository;

import com.eventsphere.assistant.entity.AiMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiMessageRepository extends JpaRepository<AiMessage, String> {
    List<AiMessage> findByTenantIdAndConversationIdOrderByCreatedAtAsc(String tenantId, String conversationId);
}
