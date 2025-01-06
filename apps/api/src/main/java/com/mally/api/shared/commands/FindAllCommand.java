package com.mally.api.shared.commands;

import com.mally.api.auth.domain.valueobjects.UserId;
import com.mally.api.shared.utils.PaginationUtils;
import jakarta.annotation.Nullable;
import org.springframework.data.domain.Pageable;

public record FindAllCommand(
        UserId userId,
        @Nullable String search,
        Pageable pageable
) {
    public FindAllCommand(UserId userId, String search, int pageNumber, int pageSize, String orderBy, String sortBy) {
        this(userId, search, PaginationUtils.buildPageable(pageNumber, pageSize, orderBy, sortBy));
    }
}
