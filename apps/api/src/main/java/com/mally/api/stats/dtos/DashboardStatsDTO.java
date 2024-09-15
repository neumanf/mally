package com.mally.api.stats.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public final class DashboardStatsDTO {
    private final UrlShortenerDashboardStats urlShortener;
    private final PastebinDashboardStats pastebin;

    public DashboardStatsDTO(Long urlsCount, Long pastebinsCount) {
        urlShortener = new UrlShortenerDashboardStats(urlsCount);
        pastebin = new PastebinDashboardStats(pastebinsCount);
    }
}

record UrlShortenerDashboardStats(Long total) {}

record PastebinDashboardStats(Long total) {}
