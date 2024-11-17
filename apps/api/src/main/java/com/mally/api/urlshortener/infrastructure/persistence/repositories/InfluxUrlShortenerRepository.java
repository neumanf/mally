package com.mally.api.urlshortener.infrastructure.persistence.repositories;

import com.mally.api.shared.repositories.InfluxRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
@AllArgsConstructor
public class InfluxUrlShortenerRepository {

    private final InfluxRepository influxRepository;

    public List<UrlClickHistoryPoint> getUrlClicksSince(Integer days, Long urlId) {
        var records = influxRepository.query(
            String.format(
                    "from(bucket:\"url-clicks\") " +
                    "|> range(start: -%sd)" +
                    "|> filter(fn: (r) => r.id == \"%d\")"
            , days, urlId)
        );

        return records.stream()
                .map(r -> new UrlClickHistoryPoint((Instant) r.getValueByKey("_time")))
                .toList();
    }
}

