package com.eventsphere.team.repository;

import com.eventsphere.team.entity.TeamInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamInvitationRepository extends JpaRepository<TeamInvitation, String> {
    Optional<TeamInvitation> findByToken(String token);
    List<TeamInvitation> findByTenantIdAndTeamIdAndStatus(String tenantId, String teamId, String status);
}
