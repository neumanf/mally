package com.mally.api.urlshortener.infrastructure.web;

import com.mally.api.auth.AuthenticationManager;
import com.mally.api.auth.UserJwt;
import com.mally.api.shared.rest.dtos.ApiResponse;
import com.mally.api.urlshortener.application.dtos.RedirectUrlResponse;
import com.mally.api.urlshortener.application.dtos.ShortenUrlRequest;
import com.mally.api.urlshortener.application.usecases.GetUrlClickHistoryUseCase;
import com.mally.api.urlshortener.application.usecases.RedirectUrlUseCase;
import com.mally.api.urlshortener.domain.entities.Url;
import com.mally.api.urlshortener.infrastructure.services.UrlShortenerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/url-shortener")
@AllArgsConstructor
public class UrlShortenerController {

    private final UrlShortenerService urlShortenerService;

    private final RedirectUrlUseCase redirectUrlUseCase;

    private final GetUrlClickHistoryUseCase getUrlClickHistoryUseCase;

    @GetMapping()
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
    public ApiResponse redirect(@PathVariable String slug) {
        String longUrl = redirectUrlUseCase.execute(slug);

        return ApiResponse.success("Redirected successfully.", new RedirectUrlResponse(longUrl));
    }

    @GetMapping("/{id}/history")
    public ApiResponse getUrlClickHistory(@PathVariable Long id) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElse(null);
        var history = getUrlClickHistoryUseCase.execute(id, userId);

        return ApiResponse.success("History obtained successfully.", history);
    }

    @PostMapping("/shorten")
    public ResponseEntity<ApiResponse> shorten(@Valid @RequestBody ShortenUrlRequest dto) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElse(null);
        final Url url = urlShortenerService.save(dto, userId);
        return ResponseEntity.ok().body(ApiResponse.success("URL shortened successfully.", url));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        urlShortenerService.delete(id);

        return ResponseEntity.ok(ApiResponse.success("URL deleted.", null));
    }

    @DeleteMapping("bulk")
    public ResponseEntity<ApiResponse> bulkDelete(@RequestParam List<Long> id) {
        urlShortenerService.deleteMany(id);

        return ResponseEntity.ok(ApiResponse.success("URLs deleted.", null));
    }
}
