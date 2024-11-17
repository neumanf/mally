package com.mally.api.urlshortener.domain.repositories;

import com.mally.api.auth.domain.valueobjects.UserId;
import com.mally.api.urlshortener.domain.entities.ShortUrl;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;
import com.mally.api.urlshortener.domain.valueobjects.Slug;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface UrlShortenerRepository {
    ShortUrl save(ShortUrl shortUrl);

    Page<ShortUrl> findAllByUserId(UserId userId, Pageable pageable);

    Optional<ShortUrl> findByIdAndUserId(ShortUrlId id, UserId userId);

    Optional<ShortUrl> findBySlug(Slug slug);

    void deleteExpiredURLs(ZonedDateTime now);

    Long countByUserId(UserId userId);

    void deleteAllById(List<ShortUrlId> ids);

    void deleteById(ShortUrlId id);
}
