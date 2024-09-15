package com.mally.api.pastebin.repositories;

import com.mally.api.pastebin.entities.Paste;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.Optional;

@Repository
public interface PastebinRepository extends CrudRepository<Paste, Long>, JpaSpecificationExecutor<Paste> {

    Page<Paste> findAll(Pageable pageable);

    Page<Paste> findAllByUserId(String userId, Pageable pageable);

    Optional<Paste> findBySlug(String slug);

    @Transactional
    @Modifying
    @Query("DELETE FROM Paste p WHERE p.expiresAt < :now")
    void deleteExpiredPastes(@Param("now") ZonedDateTime now);

    Long countByUserId(String userId);
}
