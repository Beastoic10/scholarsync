package com.scholarsync.repository;

import com.scholarsync.domain.model.ResearchTask;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResearchTaskRepository extends JpaRepository<ResearchTask, Long> {

    List<ResearchTask> findByProjectId(Long projectId);
}
