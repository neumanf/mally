package com.mally.api.urlshortener.domain.valueobjects;

import com.fasterxml.jackson.annotation.JsonValue;

public record ShortUrlId(Long value) {
    public ShortUrlId {
        assert value != null;
    }

    @JsonValue
    public Long getValue() {
        return value;
    }
}
