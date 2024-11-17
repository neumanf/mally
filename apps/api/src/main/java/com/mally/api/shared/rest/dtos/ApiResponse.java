package com.mally.api.shared.rest.dtos;

import lombok.*;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApiResponse {
    private String status;
    private String message;
    private Object data;
    private List<String> errors;

    public static ApiResponse success(String message, Object data) {
        return builder()
                .status("success")
                .message(message)
                .data(data)
                .build();
    }

    public static ApiResponse error(String message, List<String> errors) {
        return builder()
                .status("error")
                .message(message)
                .errors(errors)
                .build();
    }
}
