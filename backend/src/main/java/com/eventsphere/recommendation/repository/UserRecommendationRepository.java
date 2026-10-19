package com.eventsphere.recommendation.repository;

import com.eventsphere.recommendation.entity.UserRecommendationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRecommendationRepository extends JpaRepository<UserRecommendationEntity, String> {
    List<UserRecommendationEntity> findByTenantIdAndUserIdAndRecommendationType(String tenantId, String userId, String recommendationType);
    void deleteByTenantIdAndUserIdAndRecommendationType(String tenantId, String userId, String recommendationType);
}
