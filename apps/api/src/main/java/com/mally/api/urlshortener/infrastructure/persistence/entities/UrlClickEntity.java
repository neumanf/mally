package com.mally.api.urlshortener.infrastructure.persistence.entities;

import com.influxdb.annotations.Column;
import com.influxdb.annotations.Measurement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Measurement(name = "url-click")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlClickEntity {

    public static String BUCKET_NAME = "url-clicks";

    @Column(tag = true)
    private Long id;

    @Column
    Boolean value;

    @Column(timestamp = true)
    private Instant time;
}
