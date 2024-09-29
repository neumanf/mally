package com.mally.api.pastebin.dtos;

import com.mally.api.pastebin.entities.PasteSyntax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CreatePasteDTO {
    @NotBlank
    private String text;

    @NotNull
    private PasteSyntax syntax;

    @NotNull
    private boolean encrypted;

    @Pattern(regexp = "1h|6h|1d|3d|7d|1m", message = "Expiration time is not valid")
    private String expiration;
}
