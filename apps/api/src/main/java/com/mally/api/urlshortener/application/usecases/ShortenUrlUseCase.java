package com.mally.api.urlshortener.application.usecases;

import com.mally.api.shared.abstractions.UseCase;
import com.mally.api.urlshortener.application.commands.ShortenUrlCommand;
import com.mally.api.urlshortener.domain.entities.ShortUrl;
import com.mally.api.urlshortener.domain.repositories.UrlShortenerRepository;
import com.mally.api.urlshortener.domain.valueobjects.Slug;
import io.github.thibaultmeyer.cuid.CUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
@RequiredArgsConstructor
public class ShortenUrlUseCase implements UseCase<ShortenUrlCommand, ShortUrl> {
    static final Integer EXPIRES_IN_DAYS = 7;

    private final UrlShortenerRepository urlShortenerRepository;

    @Override
    public ShortUrl execute(ShortenUrlCommand command) {
        var slug = CUID.randomCUID2(8);
        var now = ZonedDateTime.now();

        return urlShortenerRepository.save(
            ShortUrl.builder()
                .url(command.url())
                .slug(new Slug(slug.toString()))
                .custom(false)
                .userId(command.userId())
                .createdAt(now)
                .expiresAt(now.plusDays(EXPIRES_IN_DAYS))
                .build()
        );
    }
}
