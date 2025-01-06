package com.mally.api.urlshortener.application.usecases;

import com.mally.api.shared.abstractions.UseCase;
import com.mally.api.urlshortener.domain.repositories.UrlShortenerRepository;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;
import com.mally.api.urlshortener.infrastructure.services.RabbitMQUrlShortenerPublisher;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DeleteUrlUseCase implements UseCase<ShortUrlId, Void> {

    private final UrlShortenerRepository urlShortenerRepository;

    private final RabbitMQUrlShortenerPublisher rabbitMQUrlShortenerPublisher;

    @Transactional
    @Override
    public Void execute(ShortUrlId id) {
        urlShortenerRepository.deleteById(id);
        rabbitMQUrlShortenerPublisher.notifyUrlDeletion(id);

        return null;
    }
}
