package com.scholarsync.repository;

import com.scholarsync.domain.model.ArtifactVersion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtifactVersionRepository extends JpaRepository<ArtifactVersion, Long> {

    List<ArtifactVersion> findByArtifactIdOrderByIdAsc(Long artifactId);
}
