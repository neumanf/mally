package com.mally.api.urlshortener.infrastructure.persistence.repositories;

import com.mally.api.urlshortener.domain.entities.Url;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.Optional;

@Repository
public interface JpaUrlShortenerRepository extends CrudRepository<Url, Long> {

    Page<Url> findAllByUserId(String userId, Pageable pageable);

    Optional<Url> findByIdAndUserId(Long id, String userId);

    Optional<Url> findBySlug(String slug);

    @Transactional
    @Modifying
    @Query("DELETE FROM Url u WHERE u.expiresAt < :now")
    void deleteExpiredURLs(@Param("now") ZonedDateTime now);

    Long countByUserId(String userId);
}
