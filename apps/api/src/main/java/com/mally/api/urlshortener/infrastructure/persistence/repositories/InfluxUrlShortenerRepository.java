package com.mally.api.urlshortener.infrastructure.persistence.repositories;

import com.mally.api.shared.repositories.InfluxRepository;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;
import com.mally.api.urlshortener.infrastructure.persistence.entities.UrlClickEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
@AllArgsConstructor
public class InfluxUrlShortenerRepository {

    private final InfluxRepository influxRepository;

    public List<UrlClickHistoryPoint> getUrlClicksSince(Integer days, ShortUrlId urlId) {
        var records = influxRepository.query(
            String.format(
                    "from(bucket:\"url-clicks\") " +
                    "|> range(start: -%sd)" +
                    "|> filter(fn: (r) => r.id == \"%d\")"
            , days, urlId.value())
        );

        return records.stream()
                .map(r -> new UrlClickHistoryPoint((Instant) r.getValueByKey("_time")))
                .toList();
    }

    public void saveUrlClick(ShortUrlId id) {
        UrlClickEntity urlClick = UrlClickEntity.builder()
                .id(id.value())
                .value(Boolean.TRUE)
                .time(Instant.now())
                .build();

        influxRepository.writeMeasurement(urlClick, UrlClickEntity.BUCKET_NAME);
    }

    public void deleteUrlClicks(ShortUrlId id) {
        influxRepository.deleteMeasurement(id.value(), UrlClickEntity.BUCKET_NAME);
    }
}

