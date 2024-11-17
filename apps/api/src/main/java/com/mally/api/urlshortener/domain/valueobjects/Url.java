package com.mally.api.urlshortener.domain.valueobjects;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.regex.Pattern;

public record Url(String value)  {
    public Url {
        assert value != null;
        assert Pattern.matches("https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)", value);
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
