package com.mally.api.pastebin.dtos;

import com.mally.api.pastebin.entities.PasteSyntax;
import com.mally.api.shared.rest.dtos.PaginationDTO;
import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchPastesDTO extends PaginationDTO {
    @Nullable
    String slug;

    @Nullable
    String text;

    @Nullable
    PasteSyntax syntax;

    @Nullable
    Boolean encrypted;

    @Nullable
    String createdAt;

    @Nullable
    String expiresAt;
}
