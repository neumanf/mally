package com.mally.api.shared.rest.base;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class BaseController {
    protected Pageable getPaginationInformation(Map<String, String> params) {
        var page = Integer.parseInt(params.getOrDefault("page", "0"));
        var size = Integer.parseInt(params.getOrDefault("size", "10"));
        var sortBy = params.getOrDefault("sortBy", "id");
        var order = params.getOrDefault("order", "desc");

        return PageRequest.of(
                page,
                size,
                Objects.equals(order, "desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending()
        );
    }
}
