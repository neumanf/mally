package com.mally.api.pastebin;

import com.mally.api.auth.AuthenticationManager;
import com.mally.api.auth.UserJwt;
import com.mally.api.pastebin.dtos.CreatePasteDTO;
import com.mally.api.pastebin.entities.Paste;
import com.mally.api.pastebin.services.PastebinService;
import com.mally.api.shared.rest.dtos.ApiResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/pastebin")
public class PastebinController {

    private final PastebinService pastebinService;

    @GetMapping("/")
    public ResponseEntity<Page<Paste>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String orderBy
    ) {
        var userId = AuthenticationManager.getAuthenticatedUser().map(UserJwt::getId).orElseThrow();
        var result = pastebinService.findAll(
                userId,
                search,
                PageRequest.of(pageNumber, pageSize, Sort.by(orderBy.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy))
        );

        return ResponseEntity.ok(result);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO> delete(@PathVariable Long id) {
        pastebinService.delete(id);

        return ResponseEntity.ok(ApiResponseDTO.success("Paste deleted successfully.", null));
    }

    @DeleteMapping("bulk")
    public ResponseEntity<ApiResponseDTO> bulkDelete(@RequestParam List<Long> id) {
        pastebinService.deleteMany(id);

        return ResponseEntity.ok(ApiResponseDTO.success("Pastes deleted successfully.", null));
    }
}
