package com.eventsphere.search.repository;

import com.eventsphere.search.entity.SearchQueryLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchQueryLogEntityRepository extends JpaRepository<SearchQueryLogEntity, String> {
}
