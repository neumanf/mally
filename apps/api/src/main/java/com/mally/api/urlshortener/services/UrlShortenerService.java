package com.mally.api.urlshortener.services;

import com.mally.api.urlshortener.dtos.ShortenUrlDTO;
import com.mally.api.urlshortener.entities.Url;
import com.mally.api.urlshortener.repositories.UrlShortenerRepository;
import io.github.thibaultmeyer.cuid.CUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.ZonedDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UrlShortenerService {
    static final Integer EXPIRES_IN_DAYS = 7;

    private final UrlShortenerRepository urlShortenerRepository;

    public Optional<String> findLongUrl(String slug) {
        final Optional<Url> url = urlShortenerRepository.findBySlug(slug);
        final boolean urlExpired = url.isEmpty() || url.get().getExpiresAt().isBefore(ZonedDateTime.now());

        if (urlExpired) {
            return Optional.empty();
        }

        return url.map(Url::getUrl);
    }

    public Url save(ShortenUrlDTO dto) {
        final CUID slug = CUID.randomCUID2(8);
        final ZonedDateTime createdAt = ZonedDateTime.now();

        final Url url = Url.builder()
                .url(dto.getUrl())
                .slug(slug.toString())
                .custom(false)
                .createdAt(createdAt)
                .expiresAt(createdAt.plusDays(EXPIRES_IN_DAYS))
                .build();

        return urlShortenerRepository.save(url);
    }
}
