package com.mally.api.urlshortener.domain.valueobjects;

import com.fasterxml.jackson.annotation.JsonValue;

public record Slug(String value)  {

    public Slug {
        assert value != null;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
