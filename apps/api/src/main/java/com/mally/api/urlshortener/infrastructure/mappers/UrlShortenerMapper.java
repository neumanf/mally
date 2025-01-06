package com.mally.api.urlshortener.infrastructure.mappers;

import com.mally.api.auth.domain.valueobjects.UserId;
import com.mally.api.urlshortener.domain.entities.ShortUrl;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;
import com.mally.api.urlshortener.domain.valueobjects.Slug;
import com.mally.api.urlshortener.domain.valueobjects.Url;
import com.mally.api.urlshortener.infrastructure.persistence.entities.ShortUrlEntity;

public class UrlShortenerMapper {
    public static ShortUrl toShortUrl(ShortUrlEntity entity) {
        return new ShortUrl(
            new ShortUrlId(entity.getId()),
            new Url(entity.getLongUrl()),
            new Slug(entity.getSlug()),
            entity.getCustom(),
            new UserId(entity.getUserId()),
            entity.getCreatedAt(),
            entity.getExpiresAt()
        );
    }

    public static ShortUrlEntity toEntity(ShortUrl shortUrl) {
        return ShortUrlEntity.builder()
                .id(shortUrl.getId() == null ? null : shortUrl.getId().value())
                .longUrl(shortUrl.getUrl().value())
                .slug(shortUrl.getSlug().value())
                .custom(shortUrl.getCustom())
                .userId(shortUrl.getUserId() == null ? null : shortUrl.getUserId().value())
                .createdAt(shortUrl.getCreatedAt())
                .expiresAt(shortUrl.getExpiresAt())
                .build();
    }
}
