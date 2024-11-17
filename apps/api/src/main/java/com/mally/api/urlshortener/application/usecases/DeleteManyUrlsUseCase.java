package com.mally.api.urlshortener.application.usecases;

import com.mally.api.shared.abstractions.UseCase;
import com.mally.api.urlshortener.domain.repositories.UrlShortenerRepository;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DeleteManyUrlsUseCase implements UseCase<List<ShortUrlId>, Void> {

    private final UrlShortenerRepository urlShortenerRepository;

    @Override
    public Void execute(List<ShortUrlId> ids) {
        urlShortenerRepository.deleteAllById(ids);

        return null;
    }
}
