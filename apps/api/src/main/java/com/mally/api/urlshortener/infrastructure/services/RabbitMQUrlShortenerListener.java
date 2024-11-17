package com.mally.api.urlshortener.infrastructure.services;

import com.mally.api.urlshortener.application.events.UrlDeletedEvent;
import com.mally.api.urlshortener.application.events.UrlRedirectedEvent;
import com.mally.api.urlshortener.infrastructure.configuration.UrlShortenerQueues;
import com.mally.api.urlshortener.infrastructure.persistence.repositories.InfluxUrlShortenerRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class RabbitMQUrlShortenerListener {
    private final InfluxUrlShortenerRepository influxUrlShortenerRepository;

    @RabbitListener(queues = UrlShortenerQueues.URL_REDIRECTED_QUEUE)
    public void processUrlRedirectedEvent(UrlRedirectedEvent urlRedirectedEvent) {
        log.info("Processing URL click for id = {}", urlRedirectedEvent.getId().value());

        influxUrlShortenerRepository.saveUrlClick(urlRedirectedEvent.getId());
    }

    @RabbitListener(queues = UrlShortenerQueues.URL_DELETED_QUEUE)
    public void processUrlDeletionEvent(UrlDeletedEvent urlDeletedEvent) {
        log.info("Processing URL deletion event for id = {}", urlDeletedEvent.getId().value());

        influxUrlShortenerRepository.deleteUrlClicks(urlDeletedEvent.getId());
    }
}
