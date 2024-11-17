package com.mally.api.shared.abstractions;

public interface UseCase<TRequest, TResponse> {
    TResponse execute(TRequest request);
}
