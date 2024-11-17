package com.mally.api.urlshortener.infrastructure.persistence.repositories;

import com.mally.api.auth.domain.valueobjects.UserId;
import com.mally.api.urlshortener.domain.entities.ShortUrl;
import com.mally.api.urlshortener.domain.repositories.UrlShortenerRepository;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;
import com.mally.api.urlshortener.domain.valueobjects.Slug;
import com.mally.api.urlshortener.infrastructure.mappers.UrlShortenerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JpaUrlShortenerRepository implements UrlShortenerRepository {

    private final SpringDataUrlShortenerRepository springDataUrlShortenerRepository;

    @Override
    public ShortUrl save(ShortUrl shortUrl) {
        var result = springDataUrlShortenerRepository.save(UrlShortenerMapper.toEntity(shortUrl));
        return UrlShortenerMapper.toShortUrl(result);
    }

    @Override
    public Page<ShortUrl> findAllByUserId(UserId userId, Pageable pageable) {
        var result = springDataUrlShortenerRepository.findAllByUserId(userId.value(), pageable);
        return result.map(UrlShortenerMapper::toShortUrl) ;
    }

    @Override
    public Optional<ShortUrl> findByIdAndUserId(ShortUrlId id, UserId userId) {
        var result = springDataUrlShortenerRepository.findByIdAndUserId(id.value(), userId.value());
        return result.map(UrlShortenerMapper::toShortUrl);
    }

    @Override
    public Optional<ShortUrl> findBySlug(Slug slug) {
        var result = springDataUrlShortenerRepository.findBySlug(slug.value());
        return result.map(UrlShortenerMapper::toShortUrl);
    }

    @Override
    public void deleteExpiredURLs(ZonedDateTime now) {
        springDataUrlShortenerRepository.deleteExpiredURLs(now);
    }

    @Override
    public Long countByUserId(UserId userId) {
        return springDataUrlShortenerRepository.countByUserId(userId.value());
    }

    @Override
    public void deleteAllById(List<ShortUrlId> ids) {
        springDataUrlShortenerRepository.deleteAllById(ids.stream().map(ShortUrlId::value).toList());
    }

    @Override
    public void deleteById(ShortUrlId id) {
        springDataUrlShortenerRepository.deleteById(id.value());
    }
}
