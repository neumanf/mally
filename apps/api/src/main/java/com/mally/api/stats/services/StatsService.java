package com.mally.api.stats.services;

import com.mally.api.pastebin.services.PastebinService;
import com.mally.api.stats.dtos.DashboardStatsDTO;
import com.mally.api.urlshortener.infrastructure.services.UrlShortenerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class StatsService {

    private final UrlShortenerService urlShortenerService;

    private final PastebinService pastebinService;

    public DashboardStatsDTO getDashboardStats(String userId) {
        Long urlShortenerStats = urlShortenerService.getStats(userId);
        Long pastebinStats = pastebinService.getStats(userId);

        return new DashboardStatsDTO(urlShortenerStats, pastebinStats);
    }

}
