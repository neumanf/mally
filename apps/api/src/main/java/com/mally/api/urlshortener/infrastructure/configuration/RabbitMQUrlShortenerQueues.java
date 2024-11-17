package com.mally.api.urlshortener.infrastructure.configuration;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQUrlShortenerQueues {

    @Bean
    public Queue urlRedirectedQueue() {
        return new Queue(UrlShortenerQueues.URL_REDIRECTED_QUEUE, true);
    }

    @Bean
    public Queue urlDeletedQueue() {
        return new Queue(UrlShortenerQueues.URL_DELETED_QUEUE, true);
    }
}
