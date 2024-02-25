package com.mally.api.urlshortener.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.ZonedDateTime;

@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Url {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "url_id_seq")
    @SequenceGenerator(name = "url_id_seq", sequenceName = "url_id_seq", allocationSize = 1)
    private Long id;

    @Column
    @NotNull
    private String url;

    @Column
    @NotNull
    private String slug;

    @Column(name = "created_at")
    @CreatedDate
    @NotNull
    private ZonedDateTime createdAt;
}
