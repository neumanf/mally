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

    private final UrlShortenerRepository urlShortenerRepository;

    public Optional<String> findLongUrl(String slug) {
        final Optional<Url> url = urlShortenerRepository.findUrlBySlug(slug);

        return url.map(Url::getUrl);
    }

    public Url save(ShortenUrlDTO dto) {
        final CUID slug = CUID.randomCUID2(8);
        final Url url = Url.builder()
                .url(dto.getUrl())
                .slug(slug.toString())
                .createdAt(ZonedDateTime.now())
                .build();

        return urlShortenerRepository.save(url);
    }
}
