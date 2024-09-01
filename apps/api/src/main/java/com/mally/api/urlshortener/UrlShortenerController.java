package com.mally.api.urlshortener;

import com.mally.api.auth.AuthenticationManager;
import com.mally.api.auth.UserJwt;
import com.mally.api.pastebin.dtos.SearchPastesDTO;
import com.mally.api.pastebin.entities.Paste;
import com.mally.api.shared.rest.dtos.ApiResponseDTO;
import com.mally.api.urlshortener.dtos.SearchUrlsDTO;
import com.mally.api.urlshortener.dtos.ShortenUrlDTO;
import com.mally.api.urlshortener.entities.Url;
import com.mally.api.urlshortener.services.UrlShortenerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/url-shortener")
@AllArgsConstructor
public class UrlShortenerController {

    private final UrlShortenerService urlShortenerService;

    @GetMapping("/")
    public ResponseEntity<Page<Url>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String orderBy
    ) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElseThrow();
        var result = urlShortenerService.findAll(
                userId,
                search,
                PageRequest.of(pageNumber, pageSize, Sort.by(orderBy.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy))
        );

        return ResponseEntity.ok(result);
    }

    @GetMapping("/redirect/{slug}")
    public ResponseEntity<ApiResponseDTO> redirect(@PathVariable String slug) {
        final Optional<String> longUrl = urlShortenerService.findLongUrl(slug);

        if (longUrl.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponseDTO.error("URL not found or expired.", List.of()));
        }

        Map<String, String> data = Map.of("url", longUrl.get());

        return ResponseEntity
                .ok()
                .body(ApiResponseDTO.success("Redirected successfully.", data));
    }

    @PostMapping("/shorten")
    public ResponseEntity<ApiResponseDTO> shorten(@Valid @RequestBody ShortenUrlDTO dto) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElse(null);
        final Url url = urlShortenerService.save(dto, userId);
        return ResponseEntity.ok().body(ApiResponseDTO.success("URL shortened successfully.", url));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO> delete(@PathVariable Long id) {
        urlShortenerService.delete(id);

        return ResponseEntity.ok(ApiResponseDTO.success("URL deleted.", null));
    }

    @DeleteMapping("bulk")
    public ResponseEntity<ApiResponseDTO> bulkDelete(@RequestParam List<Long> id) {
        urlShortenerService.deleteMany(id);

        return ResponseEntity.ok(ApiResponseDTO.success("URLs deleted.", null));
    }
}
