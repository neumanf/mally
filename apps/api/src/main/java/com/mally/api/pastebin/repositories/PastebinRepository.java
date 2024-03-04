package com.mally.api.pastebin.repositories;

import com.mally.api.pastebin.entities.Paste;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.Optional;

@Repository
public interface PastebinRepository extends CrudRepository<Paste, Long> {
    Optional<Paste> findBySlug(String slug);

    @Transactional
    @Modifying
    @Query("DELETE FROM Paste p WHERE p.expiresAt < :now")
    void deleteExpiredPastes(@Param("now") ZonedDateTime now);
}
