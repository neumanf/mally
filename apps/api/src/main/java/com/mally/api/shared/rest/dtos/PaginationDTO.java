package com.mally.api.shared.rest.dtos;

import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaginationDTO {
    @Nullable
    Integer pageNumber = 1;

    @Nullable
    Integer pageSize = 10;
}
