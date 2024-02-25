package com.mally.api.urlshortener;

import com.mally.api.shared.rest.ApiResponseDTO;
import com.mally.api.urlshortener.dtos.ShortenUrlDTO;
import com.mally.api.urlshortener.entities.Url;
import com.mally.api.urlshortener.services.UrlShortenerService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/url-shortener")
@AllArgsConstructor
public class UrlShortenerController {

    private final UrlShortenerService urlShortenerService;

    @GetMapping("/redirect/{slug}")
    public ResponseEntity<ApiResponseDTO> redirect(HttpServletResponse response, @PathVariable String slug) {
        final Optional<String> longUrl = urlShortenerService.findLongUrl(slug);

        if (longUrl.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponseDTO.error("URL not found.", List.of("URL_NOT_FOUND")));
        }

        try {
            response.sendRedirect(longUrl.get());
            return ResponseEntity
                    .ok()
                    .body(ApiResponseDTO.success("Redirected successfully.", null));
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body(ApiResponseDTO.error("An error occurred while redirecting.", List.of()));
        }
    }

    @PostMapping("/shorten")
    public ResponseEntity<ApiResponseDTO> shorten(@RequestBody ShortenUrlDTO dto) {
        final Url url = urlShortenerService.save(dto);
        return ResponseEntity.ok().body(ApiResponseDTO.success("URL shortened successfully.", url));
    }
}
