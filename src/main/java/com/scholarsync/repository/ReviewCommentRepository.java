package com.scholarsync.repository;

import com.scholarsync.domain.model.ReviewComment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {

    List<ReviewComment> findByArtifactVersionId(Long artifactVersionId);
}
