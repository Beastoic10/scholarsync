package com.scholarsync.repository;

import com.scholarsync.domain.model.ResearchProject;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResearchProjectRepository extends JpaRepository<ResearchProject, Long> {

    List<ResearchProject> findByAdvisorId(Long advisorId);
}
