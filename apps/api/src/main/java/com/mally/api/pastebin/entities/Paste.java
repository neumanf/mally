package com.mally.api.pastebin.entities;

import jakarta.annotation.Nullable;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @ColumnDefault("Untitled")
    @NotNull
    private String title;

    @Column(unique = true)
    @NotNull
    private String slug;

    @Column
    @NotNull
    private String text;

    @Column
    @Enumerated(EnumType.STRING)
    @ColumnDefault("PLAINTEXT")
    @NotNull
    private PasteSyntax syntax;

    @Column
    @ColumnDefault("false")
    @NotNull
    private boolean encrypted;

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

    public static class PasteBuilder {
        private ZonedDateTime expiresAt;
        
        public PasteBuilder expiresAt(String expirationTime) {
            ZonedDateTime now = ZonedDateTime.now();

            switch (expirationTime) {
                case "6h": { expiresAt = now.plusHours(6); break; }
                case "1d": { expiresAt = now.plusDays(1); break; }
                case "3d": { expiresAt = now.plusDays(3); break; }
                case "7d": { expiresAt = now.plusDays(7); break; }
                case "1m": { expiresAt = now.plusMonths(1); break; }
                case "1h":
                default: expiresAt = now.plusHours(1);
            }

            return this;
        }

        public PasteBuilder expiresAt(ZonedDateTime expirationTime) {
            this.expiresAt = expirationTime;
            return this;
        }
    }
}

