package com.mally.api.shared.schedulers;


import com.mally.api.pastebin.services.PastebinService;
import com.mally.api.urlshortener.services.UrlShortenerService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@EnableScheduling
@AllArgsConstructor
@Slf4j
@Component
public class ExpiredRecordsPurger {
    static private final String AT_MIDNIGHT_CRON = "0 0 0 * * *";

    private final UrlShortenerService urlShortenerService;

    private final PastebinService pastebinService;

    @Scheduled(cron = AT_MIDNIGHT_CRON)
    public void purgeExpiredRecords() {
        deleteExpiredURLs();
        deleteExpiredPastes();

        log.info("Expired records purged.");
    }

    private void deleteExpiredURLs() {
        urlShortenerService.deleteExpiredURLs();
    }

    private void deleteExpiredPastes() {
        pastebinService.deleteExpiredPastes();
    }
}
