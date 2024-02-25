package com.mally.api.shared.rest;

import lombok.*;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApiResponseDTO {
    private String status;
    private String message;
    private Object data;
    private List<String> errors;

    public static ApiResponseDTO success(String message, Object data) {
        return builder()
                .status("success")
                .message(message)
                .data(data)
                .build();
    }

    public static ApiResponseDTO error(String message, List<String> errors) {
        return builder()
                .status("error")
                .message(message)
                .errors(errors)
                .build();
    }
}
