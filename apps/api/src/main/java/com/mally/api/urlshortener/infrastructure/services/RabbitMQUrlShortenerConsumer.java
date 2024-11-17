package com.mally.api.urlshortener.infrastructure.services;

import com.mally.api.urlshortener.application.events.UrlRedirectedEvent;
import com.mally.api.urlshortener.infrastructure.configuration.UrlShortenerQueues;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQUrlShortenerConsumer {

    @RabbitListener(queues = UrlShortenerQueues.URL_REDIRECTED_QUEUE)
    public void processUrlRedirectedEvent(UrlRedirectedEvent urlRedirectedEvent) {
        // save to timeseries db
    }
}
