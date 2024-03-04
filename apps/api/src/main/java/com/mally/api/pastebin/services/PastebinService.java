package com.mally.api.pastebin.services;

import com.mally.api.pastebin.dtos.CreatePasteDTO;
import com.mally.api.pastebin.entities.Paste;
import com.mally.api.pastebin.repositories.PastebinRepository;
import io.github.thibaultmeyer.cuid.CUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Optional;

@AllArgsConstructor
@Service
public class PastebinService {
    private static final Integer EXPIRES_IN_DAYS = 7;

    private final PastebinRepository pastebinRepository;

    public Optional<Paste> findBySlug(String slug) {
        return pastebinRepository.findBySlug(slug);
    }

    public Paste create(CreatePasteDTO dto) {
        final ZonedDateTime now = ZonedDateTime.now();
        final CUID slug = CUID.randomCUID2(22);

        Paste paste = Paste.builder()
                .text(dto.getText())
                .syntax(dto.getSyntax())
                .slug(slug.toString())
                .createdAt(now)
                .expiresAt(now.plusDays(EXPIRES_IN_DAYS))
                .build();

        return pastebinRepository.save(paste);
    }

    public void deleteExpiredPastes() {
        pastebinRepository.deleteExpiredPastes(ZonedDateTime.now());
    }
}
