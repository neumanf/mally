package com.mally.api.urlshortener.application.usecases;

import com.mally.api.shared.abstractions.UseCase;
import com.mally.api.shared.commands.FindAllCommand;
import com.mally.api.shared.utils.PaginationUtils;
import com.mally.api.urlshortener.domain.entities.ShortUrl;
import com.mally.api.urlshortener.domain.repositories.UrlShortenerRepository;
import com.mally.api.urlshortener.infrastructure.mappers.UrlShortenerMapper;
import com.mally.api.urlshortener.infrastructure.persistence.entities.ShortUrlEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FindAllUrlsUseCase implements UseCase<FindAllCommand, Page<ShortUrl>> {

    private final UrlShortenerRepository urlShortenerRepository;

    private final EntityManager entityManager;

    @Override
    public Page<ShortUrl> execute(FindAllCommand findAllCommand) {
        var search = findAllCommand.search();
        var userId = findAllCommand.userId();
        var pageable = findAllCommand.pageable();

        if (search != null && !search.isEmpty()) {
            List<String> searchFields = List.of("url", "slug");

            var results = PaginationUtils.paginateSearch(entityManager, ShortUrlEntity.class, searchFields, search, userId.value(), pageable);

            return results.map(UrlShortenerMapper::toShortUrl);
        }

        return urlShortenerRepository.findAllByUserId(userId, pageable);
    }
}
