package com.mally.api.urlshortener.infrastructure.web;

import com.mally.api.auth.AuthenticationManager;
import com.mally.api.auth.UserJwt;
import com.mally.api.shared.commands.FindAllCommand;
import com.mally.api.shared.rest.dtos.ApiResponse;
import com.mally.api.urlshortener.application.commands.GetUrlClickHistoryCommand;
import com.mally.api.urlshortener.application.commands.ShortenUrlCommand;
import com.mally.api.urlshortener.application.dtos.RedirectUrlResponse;
import com.mally.api.urlshortener.application.dtos.ShortenUrlRequest;
import com.mally.api.urlshortener.application.usecases.*;
import com.mally.api.urlshortener.domain.entities.ShortUrl;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;
import com.mally.api.urlshortener.domain.valueobjects.Slug;
import com.mally.api.urlshortener.domain.valueobjects.Url;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/url-shortener")
@AllArgsConstructor
public class UrlShortenerController {

    private final FindAllUrlsUseCase findAllUrlsUseCase;
    private final RedirectUrlUseCase redirectUrlUseCase;
    private final GetUrlClickHistoryUseCase getUrlClickHistoryUseCase;
    private final DeleteUrlUseCase deleteUrlUseCase;
    private final ShortenUrlUseCase shortenUrlUseCase;
    private final DeleteManyUrlsUseCase deleteManyUrlsUseCase;

    @GetMapping()
    public Page<ShortUrl> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String orderBy
    ) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElseThrow();

        return findAllUrlsUseCase.execute(new FindAllCommand(
            userId, search, pageNumber, pageSize, orderBy, sortBy
        ));
    }

    @GetMapping("/redirect/{slug}")
    public ApiResponse redirect(@PathVariable String slug) {
        var longUrl = redirectUrlUseCase.execute(new Slug(slug));

        return ApiResponse.success("Redirected successfully.", new RedirectUrlResponse(longUrl.value()));
    }

    @GetMapping("/{id}/history")
    public ApiResponse getUrlClickHistory(@PathVariable Long id) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElse(null);

        var history = getUrlClickHistoryUseCase.execute(
            new GetUrlClickHistoryCommand(new ShortUrlId(id), userId)
        );

        return ApiResponse.success("History obtained successfully.", history);
    }

    @PostMapping("/shorten")
    public ResponseEntity<ApiResponse> shorten(@Valid @RequestBody ShortenUrlRequest dto) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElse(null);

        var url = shortenUrlUseCase.execute(
            new ShortenUrlCommand(new Url(dto.url()), userId)
        );

        return ResponseEntity.ok().body(ApiResponse.success("URL shortened successfully.", url));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        deleteUrlUseCase.execute(new ShortUrlId(id));

        return ResponseEntity.ok(ApiResponse.success("URL deleted.", null));
    }

    @DeleteMapping("bulk")
    public ResponseEntity<ApiResponse> bulkDelete(@RequestParam List<Long> id) {
        deleteManyUrlsUseCase.execute(id.stream().map(ShortUrlId::new).toList());

        return ResponseEntity.ok(ApiResponse.success("URLs deleted.", null));
    }
}
