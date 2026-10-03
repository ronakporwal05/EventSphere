package com.eventsphere.team.repository;

import com.eventsphere.team.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, String> {
    List<TeamMember> findByTenantIdAndTeamIdAndStatus(String tenantId, String teamId, String status);
    Optional<TeamMember> findByTenantIdAndTeamIdAndUserIdAndStatus(String tenantId, String teamId, String userId, String status);
    long countByTenantIdAndTeamIdAndStatus(String tenantId, String teamId, String status);
}
