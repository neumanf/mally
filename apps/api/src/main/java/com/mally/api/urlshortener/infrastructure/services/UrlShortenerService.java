package com.mally.api.urlshortener.infrastructure.services;

import com.mally.api.urlshortener.infrastructure.persistence.repositories.SpringDataUrlShortenerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Service
@AllArgsConstructor
public class UrlShortenerService {
    private final SpringDataUrlShortenerRepository springDataUrlShortenerRepository;
    
    public void deleteExpiredURLs() {
        springDataUrlShortenerRepository.deleteExpiredURLs(ZonedDateTime.now());
    }

    public Long getStats(String userId) {
        return springDataUrlShortenerRepository.countByUserId(userId);
    }
}
