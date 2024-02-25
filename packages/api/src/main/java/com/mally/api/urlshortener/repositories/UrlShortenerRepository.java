package com.mally.api.urlshortener.repositories;

import com.mally.api.urlshortener.entities.Url;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UrlShortenerRepository extends CrudRepository<Url, Long> {
    Optional<Url> findUrlBySlug(String slug);
}
