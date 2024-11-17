package com.mally.api.urlshortener.application.commands;

import com.mally.api.auth.domain.valueobjects.UserId;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;

public record GetUrlClickHistoryCommand(ShortUrlId urlId, UserId userId) {
}
