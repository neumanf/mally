package com.mally.api.urlshortener.infrastructure.services;

import com.mally.api.shared.repositories.InfluxRepository;
import com.mally.api.urlshortener.application.events.UrlRedirectedEvent;
import com.mally.api.urlshortener.domain.entities.UrlClick;
import com.mally.api.urlshortener.infrastructure.configuration.UrlShortenerQueues;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@AllArgsConstructor
public class RabbitMQUrlShortenerConsumer {

    private final Logger log = LoggerFactory.getLogger(RabbitMQUrlShortenerConsumer.class);

    private final InfluxRepository influxRepository;

    @RabbitListener(queues = UrlShortenerQueues.URL_REDIRECTED_QUEUE)
    public void processUrlRedirectedEvent(UrlRedirectedEvent urlRedirectedEvent) {
        UrlClick urlClick = UrlClick.builder()
                .id(urlRedirectedEvent.getId())
                .value(Boolean.TRUE)
                .time(Instant.now())
                .build();

        influxRepository.writeMeasurement(urlClick, UrlClick.BUCKET_NAME);
        log.info("Published URL click count for id = {}", urlClick.getId());
    }
}
