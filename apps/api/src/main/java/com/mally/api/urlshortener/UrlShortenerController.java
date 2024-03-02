package com.mally.api.urlshortener;

import com.mally.api.shared.rest.dtos.ApiResponseDTO;
import com.mally.api.urlshortener.dtos.ShortenUrlDTO;
import com.mally.api.urlshortener.entities.Url;
import com.mally.api.urlshortener.services.UrlShortenerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/url-shortener")
@AllArgsConstructor
public class UrlShortenerController {

    private final UrlShortenerService urlShortenerService;

    @GetMapping("/redirect/{slug}")
    public ResponseEntity<ApiResponseDTO> redirect(@PathVariable String slug) {
        try {
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
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body(ApiResponseDTO.error("An error occurred while redirecting.", List.of()));
        }
    }

    @PostMapping("/shorten")
    public ResponseEntity<ApiResponseDTO> shorten(@Valid @RequestBody ShortenUrlDTO dto) {
        try {
            final Url url = urlShortenerService.save(dto);
            return ResponseEntity.ok().body(ApiResponseDTO.success("URL shortened successfully.", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponseDTO.error("An unexpected error occurred while shortening the URL.", List.of()));
        }
    }
}
