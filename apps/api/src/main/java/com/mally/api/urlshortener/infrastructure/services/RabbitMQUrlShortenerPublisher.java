package com.mally.api.urlshortener.infrastructure.services;

import com.mally.api.urlshortener.application.events.UrlRedirectedEvent;
import com.mally.api.urlshortener.infrastructure.configuration.UrlShortenerQueues;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class RabbitMQUrlShortenerPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void notifyUrlRedirection(Long id) {
        rabbitTemplate.convertAndSend(
                UrlShortenerQueues.URL_REDIRECTED_QUEUE,
                UrlRedirectedEvent.builder().id(id).build()
        );
    }
}
