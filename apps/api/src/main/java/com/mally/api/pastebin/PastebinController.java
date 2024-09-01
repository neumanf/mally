package com.mally.api.pastebin;

import com.mally.api.auth.AuthenticationManager;
import com.mally.api.auth.UserJwt;
import com.mally.api.pastebin.dtos.CreatePasteDTO;
import com.mally.api.pastebin.dtos.SearchPastesDTO;
import com.mally.api.pastebin.entities.Paste;
import com.mally.api.pastebin.services.PastebinService;
import com.mally.api.shared.rest.dtos.ApiResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/pastebin")
public class PastebinController {

    private final PastebinService pastebinService;

    @GetMapping("/search")
    public ResponseEntity<Page<Paste>> search(@RequestParam String query, Pageable pageable) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElse(null);

        return ResponseEntity.ok().body(pastebinService.search(query, userId, pageable));
    }

    @GetMapping("/paste/{slug}")
    public ResponseEntity<ApiResponseDTO> findPaste(@PathVariable String slug) {
        return pastebinService.findBySlug(slug)
                    .map(p -> ResponseEntity
                            .ok()
                            .body(ApiResponseDTO.success("Paste found successfully.", p)))
                    .orElseGet(() -> ResponseEntity
                            .badRequest()
                            .body(ApiResponseDTO.error("Paste not found.", List.of())));
    }

    @PostMapping("/paste")
    public ResponseEntity<ApiResponseDTO> paste(@Valid @RequestBody CreatePasteDTO dto) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElse(null);
        var paste = pastebinService.create(dto, userId);

        return ResponseEntity
                    .ok()
                    .body(ApiResponseDTO.success("Paste created successfully.", paste));
    }
}
