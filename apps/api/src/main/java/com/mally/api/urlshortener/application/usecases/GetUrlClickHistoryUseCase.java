package com.mally.api.urlshortener.application.usecases;

import com.mally.api.urlshortener.infrastructure.persistence.repositories.InfluxUrlShortenerRepository;
import com.mally.api.urlshortener.infrastructure.persistence.repositories.JpaUrlShortenerRepository;
import com.mally.api.urlshortener.infrastructure.persistence.repositories.UrlClickHistoryPoint;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class GetUrlClickHistoryUseCase {
    private static final int DEFAULT_HISTORY_DAYS = 30;

    private final InfluxUrlShortenerRepository urlShortenerRepository;

    private final JpaUrlShortenerRepository jpaUrlShortenerRepository;

    public List<UrlClickHistoryPoint> execute(Long urlId, String userId) {
        jpaUrlShortenerRepository
                .findByIdAndUserId(urlId, userId)
                .orElseThrow(() -> new RuntimeException("Short URL not found"));

        return urlShortenerRepository.getUrlClicksSince(DEFAULT_HISTORY_DAYS, urlId);
    }
}
