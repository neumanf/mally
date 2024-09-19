package com.mally.api.pastebin.services;

import com.mally.api.pastebin.dtos.CreatePasteDTO;
import com.mally.api.pastebin.dtos.SearchPastesDTO;
import com.mally.api.pastebin.entities.Paste;
import com.mally.api.pastebin.repositories.PastebinRepository;
import com.mally.api.shared.utils.PaginationUtils;
import io.github.thibaultmeyer.cuid.CUID;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class PastebinService {
    private static final Integer EXPIRES_IN_DAYS = 7;

    private final PastebinRepository pastebinRepository;

    private final EntityManager entityManager;

    public Optional<Paste> findBySlug(String slug) {
        return pastebinRepository.findBySlug(slug);
    }

    public Paste create(CreatePasteDTO dto, String userId) {
        final ZonedDateTime now = ZonedDateTime.now();
        final CUID slug = CUID.randomCUID2(22);

        Paste paste = Paste.builder()
                .text(dto.getText())
                .syntax(dto.getSyntax())
                .slug(slug.toString())
                .encrypted(dto.isEncrypted())
                .userId(userId)
                .createdAt(now)
                .expiresAt(now.plusDays(EXPIRES_IN_DAYS))
                .build();

        return pastebinRepository.save(paste);
    }

    public void deleteExpiredPastes() {
        pastebinRepository.deleteExpiredPastes(ZonedDateTime.now());
    }

    public Long getStats(String userId) {
        return pastebinRepository.countByUserId(userId);
    }

    public Page<Paste> findAll(String userId, String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            List<String> searchFields = List.of("slug", "text", "syntax");

            return PaginationUtils.paginateSearch(entityManager, Paste.class, searchFields, search, userId, pageable);
        }

        return pastebinRepository.findAllByUserId(userId, pageable);
    }

    public void delete(Long id) {
        pastebinRepository.deleteById(id);
    }

    public void deleteMany(List<Long> ids) {
        pastebinRepository.deleteAllById(ids);
    }
}
