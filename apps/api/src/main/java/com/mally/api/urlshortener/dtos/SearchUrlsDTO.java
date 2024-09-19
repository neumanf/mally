package com.mally.api.urlshortener.dtos;

import com.mally.api.shared.rest.dtos.PaginationDTO;
import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchUrlsDTO extends PaginationDTO {
    @Nullable
    String url;

    @Nullable
    String slug;

    @Nullable
    Boolean custom;

    @Nullable
    String createdAt;

    @Nullable
    String expiresAt;
}
