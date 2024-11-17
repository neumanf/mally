package com.mally.api.urlshortener.application.usecases;

import com.mally.api.shared.abstractions.UseCase;
import com.mally.api.urlshortener.application.exceptions.UrlNotFoundOrExpiredException;
import com.mally.api.urlshortener.domain.entities.Url;
import com.mally.api.urlshortener.infrastructure.persistence.repositories.UrlShortenerRepository;
import com.mally.api.urlshortener.infrastructure.services.RabbitMQUrlShortenerPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RedirectUrlUseCase implements UseCase<String, String> {

    private final UrlShortenerRepository urlShortenerRepository;

    private final RabbitMQUrlShortenerPublisher rabbitMQUrlShortenerPublisher;

    @Override
    public String execute(String slug) {
        Optional<Url> url = urlShortenerRepository.findBySlug(slug);
        boolean urlExpired = url.isEmpty() || url.get().getExpiresAt().isBefore(ZonedDateTime.now());

        if (urlExpired) {
            throw new UrlNotFoundOrExpiredException();
        }

        rabbitMQUrlShortenerPublisher.notifyUrlRedirection(slug);

        return url.get().getUrl();
    }
}
