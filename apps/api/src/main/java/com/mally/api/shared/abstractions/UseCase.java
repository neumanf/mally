package com.mally.api.shared.abstractions;

import com.fasterxml.jackson.core.JsonProcessingException;

public interface UseCase<TRequest, TResponse> {
    TResponse execute(TRequest request) throws JsonProcessingException;
}
