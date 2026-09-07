package com.scholarsync.repository;

import com.scholarsync.domain.model.Reference;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReferenceRepository extends JpaRepository<Reference, Long> {

    List<Reference> findByTaskId(Long taskId);
}
