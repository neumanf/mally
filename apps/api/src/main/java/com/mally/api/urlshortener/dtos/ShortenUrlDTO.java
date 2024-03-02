package com.mally.api.urlshortener.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ShortenUrlDTO {
    @URL
    @NotBlank
    private String url;
}
