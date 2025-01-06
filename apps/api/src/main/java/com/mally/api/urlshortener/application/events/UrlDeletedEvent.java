package com.mally.api.urlshortener.application.events;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlDeletedEvent implements Serializable {

    @JsonProperty
    private ShortUrlId id;

}
