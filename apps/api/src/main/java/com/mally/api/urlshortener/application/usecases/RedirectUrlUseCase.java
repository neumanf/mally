package com.mally.api.urlshortener.application.usecases;

import com.mally.api.shared.abstractions.UseCase;
import com.mally.api.urlshortener.application.exceptions.UrlNotFoundOrExpiredException;
import com.mally.api.urlshortener.domain.repositories.UrlShortenerRepository;
import com.mally.api.urlshortener.domain.valueobjects.Slug;
import com.mally.api.urlshortener.domain.valueobjects.Url;
import com.mally.api.urlshortener.infrastructure.services.RabbitMQUrlShortenerPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class RedirectUrlUseCase implements UseCase<Slug, Url> {

    private final UrlShortenerRepository urlShortenerRepository;

    private final RabbitMQUrlShortenerPublisher rabbitMQUrlShortenerPublisher;

    @Override
    public Url execute(Slug slug) {
        var url = urlShortenerRepository.findBySlug(slug);
        var urlExpired = url.isEmpty() || url.get().getExpiresAt().isBefore(ZonedDateTime.now());

        if (urlExpired) {
            throw new UrlNotFoundOrExpiredException();
        }

        rabbitMQUrlShortenerPublisher.notifyUrlRedirection(url.get().getId());

        return url.get().getUrl();
    }
}
