package com.mally.api.pastebin;

import com.mally.api.pastebin.dtos.CreatePasteDTO;
import com.mally.api.pastebin.entities.Paste;
import com.mally.api.pastebin.services.PastebinService;
import com.mally.api.shared.rest.dtos.ApiResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/pastebin")
public class PastebinController {

    private final PastebinService pastebinService;

    @GetMapping("/paste/{slug}")
    public ResponseEntity<ApiResponseDTO> findPaste(@PathVariable String slug) {
        try {
            Optional<Paste> paste = pastebinService.findBySlug(slug);
            return paste
                    .map(p -> ResponseEntity
                            .ok()
                            .body(ApiResponseDTO.success("Paste found successfully.", p)))
                    .orElseGet(() -> ResponseEntity
                            .badRequest()
                            .body(ApiResponseDTO.error("Paste not found.", List.of())));
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body(
                            ApiResponseDTO.error(
                                    "An unexpected error occurred while finding the paste.",
                                    List.of()
                            )
                    );
        }
    }

    @PostMapping("/paste")
    public ResponseEntity<ApiResponseDTO> paste(@Valid @RequestBody CreatePasteDTO dto) {
        try {
            Paste paste = pastebinService.create(dto);

            return ResponseEntity
                    .ok()
                    .body(ApiResponseDTO.success("Paste created successfully.", paste));
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body(
                            ApiResponseDTO.error(
                                    "An unexpected error occurred while creating the paste.",
                                    List.of()
                            )
                    );
        }
    }
}
