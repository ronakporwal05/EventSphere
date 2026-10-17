package com.eventsphere.invitation.repository;

import com.eventsphere.invitation.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, String> {
    Optional<Invitation> findByToken(String token);
    List<Invitation> findByTenantId(String tenantId);
    List<Invitation> findByTenantIdAndStatus(String tenantId, String status);
}
