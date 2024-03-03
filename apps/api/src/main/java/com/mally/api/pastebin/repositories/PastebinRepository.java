package com.mally.api.pastebin.repositories;

import com.mally.api.pastebin.entities.Paste;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PastebinRepository extends CrudRepository<Paste, Long> {
    Optional<Paste> findBySlug(String slug);
}
