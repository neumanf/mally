package com.mally.api.urlshortener.infrastructure.services;

import com.mally.api.shared.utils.PaginationUtils;
import com.mally.api.urlshortener.application.dtos.ShortenUrlRequest;
import com.mally.api.urlshortener.domain.entities.Url;
import com.mally.api.urlshortener.infrastructure.persistence.repositories.JpaUrlShortenerRepository;
import io.github.thibaultmeyer.cuid.CUID;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UrlShortenerService {
    static final Integer EXPIRES_IN_DAYS = 7;

    private final JpaUrlShortenerRepository jpaUrlShortenerRepository;
    
    private final EntityManager entityManager;

    public Page<Url> findAll(String userId, @Nullable String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            List<String> searchFields = List.of("url", "slug");

            return PaginationUtils.paginateSearch(entityManager, Url.class, searchFields, search, userId, pageable);
        }

        return jpaUrlShortenerRepository.findAllByUserId(userId, pageable);
    }

    public Optional<String> findLongUrl(String slug) {
        final Optional<Url> url = jpaUrlShortenerRepository.findBySlug(slug);
        final boolean urlExpired = url.isEmpty() || url.get().getExpiresAt().isBefore(ZonedDateTime.now());

        if (urlExpired) {
            return Optional.empty();
        }

        return url.map(Url::getUrl);
    }

    public Url save(ShortenUrlRequest dto, String userId) {
        final CUID slug = CUID.randomCUID2(8);
        final ZonedDateTime createdAt = ZonedDateTime.now();

        final Url url = Url.builder()
                .url(dto.url())
                .slug(slug.toString())
                .custom(false)
                .userId(userId)
                .createdAt(createdAt)
                .expiresAt(createdAt.plusDays(EXPIRES_IN_DAYS))
                .build();

        return jpaUrlShortenerRepository.save(url);
    }

    public void deleteExpiredURLs() {
        jpaUrlShortenerRepository.deleteExpiredURLs(ZonedDateTime.now());
    }

    public void delete(Long id) {
        jpaUrlShortenerRepository.deleteById(id);
    }

    public void deleteMany(List<Long> ids) {
        jpaUrlShortenerRepository.deleteAllById(ids);
    }

    public Long getStats(String userId) {
        return jpaUrlShortenerRepository.countByUserId(userId);
    }
}
