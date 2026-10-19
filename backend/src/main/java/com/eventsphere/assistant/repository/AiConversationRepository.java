package com.eventsphere.assistant.repository;

import com.eventsphere.assistant.entity.AiConversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiConversationRepository extends JpaRepository<AiConversation, String> {
    Page<AiConversation> findByTenantIdAndUserIdAndDeletedFalse(String tenantId, String userId, Pageable pageable);
    Optional<AiConversation> findByIdAndTenantIdAndUserIdAndDeletedFalse(String id, String tenantId, String userId);
}
