package com.mally.api.urlshortener.infrastructure.persistence.entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.ZonedDateTime;

@Builder
@Entity(name = "short_url")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ShortUrlEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "long_url")
    @NotNull
    private String longUrl;

    @Column(unique = true)
    @NotNull
    private String slug;

    @Column()
    @NotNull
    private Boolean custom;

    @Column()
    @Nullable()
    private String userId;

    @Column(name = "created_at")
    @CreatedDate
    @NotNull
    private ZonedDateTime createdAt;

    @Column(name = "expires_at")
    @NotNull
    private ZonedDateTime expiresAt;
}
