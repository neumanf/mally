package com.mally.api.urlshortener.application.commands;

import com.mally.api.auth.domain.valueobjects.UserId;
import com.mally.api.urlshortener.domain.valueobjects.Url;

public record ShortenUrlCommand(Url url, UserId userId) {
}
