package com.mally.api.urlshortener.application.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UrlNotFoundOrExpiredException extends ResponseStatusException {
    public UrlNotFoundOrExpiredException() {
        super(HttpStatus.NOT_FOUND, "URL not found or expired");
    }
}
