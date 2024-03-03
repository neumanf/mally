package com.mally.api.pastebin.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

import java.time.ZonedDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Paste {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "paste_id_seq")
    @SequenceGenerator(name = "paste_id_seq", sequenceName = "paste_id_seq", allocationSize = 1)
    private Long id;

    @Column(unique = true)
    @NotNull
    private String slug;

    @Column
    @NotNull
    private String text;

    @Column
    @Enumerated(EnumType.STRING)
    @ColumnDefault("PLAIN_TEXT")
    @NotNull
    private PasteSyntax syntax;

    @Column(name = "created_at")
    @CreatedDate
    @NotNull
    private ZonedDateTime createdAt;

    @Column(name = "expires_at")
    @NotNull
    private ZonedDateTime expiresAt;
}

