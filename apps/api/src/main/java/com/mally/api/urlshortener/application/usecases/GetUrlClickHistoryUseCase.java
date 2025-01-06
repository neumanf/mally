package com.mally.api.urlshortener.application.usecases;

import com.mally.api.shared.abstractions.UseCase;
import com.mally.api.urlshortener.application.commands.GetUrlClickHistoryCommand;
import com.mally.api.urlshortener.application.exceptions.UrlNotFoundOrExpiredException;
import com.mally.api.urlshortener.domain.repositories.UrlShortenerRepository;
import com.mally.api.urlshortener.infrastructure.persistence.repositories.InfluxUrlShortenerRepository;
import com.mally.api.urlshortener.infrastructure.persistence.repositories.UrlClickHistoryPoint;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class GetUrlClickHistoryUseCase implements UseCase<GetUrlClickHistoryCommand, List<UrlClickHistoryPoint>> {
    private static final int DEFAULT_HISTORY_DAYS = 30;

    private final InfluxUrlShortenerRepository influxUrlShortenerRepository;

    private final UrlShortenerRepository urlShortenerRepository;

    @Override
    public List<UrlClickHistoryPoint> execute(GetUrlClickHistoryCommand command) {
        urlShortenerRepository
                .findByIdAndUserId(command.urlId(), command.userId())
                .orElseThrow(UrlNotFoundOrExpiredException::new);

        return influxUrlShortenerRepository.getUrlClicksSince(DEFAULT_HISTORY_DAYS, command.urlId());
    }
}
