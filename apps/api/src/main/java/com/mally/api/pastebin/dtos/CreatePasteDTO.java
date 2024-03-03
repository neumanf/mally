package com.mally.api.pastebin.dtos;

import com.mally.api.pastebin.entities.PasteSyntax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
}
