package com.mally.api.urlshortener.infrastructure.persistence.repositories;

import java.time.Instant;

public record UrlClickHistoryPoint(Instant timestamp) {

}
