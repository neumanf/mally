package com.mally.api.urlshortener.application.dtos;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

public record ShortenUrlRequest (
    @URL
    @NotBlank
    String url
) {}
