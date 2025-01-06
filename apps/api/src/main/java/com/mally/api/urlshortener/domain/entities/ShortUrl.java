package com.mally.api.urlshortener.domain.entities;

import com.mally.api.auth.domain.valueobjects.UserId;
import com.mally.api.urlshortener.domain.valueobjects.ShortUrlId;
import com.mally.api.urlshortener.domain.valueobjects.Slug;
import com.mally.api.urlshortener.domain.valueobjects.Url;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

import java.time.ZonedDateTime;

public class ShortUrl {
    @NotNull
    private ShortUrlId id;

    @NotNull
    private Url url;

    @NotNull
    private Slug slug;

    @NotNull
    private Boolean custom;

    @Nullable
    private UserId userId;

    @NotNull
    private ZonedDateTime createdAt;

    @NotNull
    private ZonedDateTime expiresAt;

    public ShortUrl(@NotNull ShortUrlId id, @NotNull Url url, @NotNull Slug slug, @NotNull Boolean custom, @Nullable UserId userId, @NotNull ZonedDateTime createdAt, @NotNull ZonedDateTime expiresAt) {
        this.id = id;
        this.url = url;
        this.slug = slug;
        this.custom = custom;
        this.userId = userId;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public static ShortUrlBuilder builder() {
        return new ShortUrlBuilder();
    }

    public @NotNull ShortUrlId getId() {
        return this.id;
    }

    public @NotNull Url getUrl() {
        return this.url;
    }

    public @NotNull Slug getSlug() {
        return this.slug;
    }

    public @NotNull Boolean getCustom() {
        return this.custom;
    }

    @Nullable
    public UserId getUserId() {
        return this.userId;
    }

    public @NotNull ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public @NotNull ZonedDateTime getExpiresAt() {
        return this.expiresAt;
    }

    public void setId(@NotNull ShortUrlId id) {
        this.id = id;
    }

    public void setUrl(@NotNull Url url) {
        this.url = url;
    }

    public void setSlug(@NotNull Slug slug) {
        this.slug = slug;
    }

    public void setCustom(@NotNull Boolean custom) {
        this.custom = custom;
    }

    public void setUserId(@Nullable UserId userId) {
        this.userId = userId;
    }

    public void setCreatedAt(@NotNull ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setExpiresAt(@NotNull ZonedDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof ShortUrl)) return false;
        final ShortUrl other = (ShortUrl) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$url = this.getUrl();
        final Object other$url = other.getUrl();
        if (this$url == null ? other$url != null : !this$url.equals(other$url)) return false;
        final Object this$slug = this.getSlug();
        final Object other$slug = other.getSlug();
        if (this$slug == null ? other$slug != null : !this$slug.equals(other$slug)) return false;
        final Object this$custom = this.getCustom();
        final Object other$custom = other.getCustom();
        if (this$custom == null ? other$custom != null : !this$custom.equals(other$custom)) return false;
        final Object this$userId = this.getUserId();
        final Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        final Object this$createdAt = this.getCreatedAt();
        final Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        final Object this$expiresAt = this.getExpiresAt();
        final Object other$expiresAt = other.getExpiresAt();
        if (this$expiresAt == null ? other$expiresAt != null : !this$expiresAt.equals(other$expiresAt)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof ShortUrl;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $url = this.getUrl();
        result = result * PRIME + ($url == null ? 43 : $url.hashCode());
        final Object $slug = this.getSlug();
        result = result * PRIME + ($slug == null ? 43 : $slug.hashCode());
        final Object $custom = this.getCustom();
        result = result * PRIME + ($custom == null ? 43 : $custom.hashCode());
        final Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        final Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        final Object $expiresAt = this.getExpiresAt();
        result = result * PRIME + ($expiresAt == null ? 43 : $expiresAt.hashCode());
        return result;
    }

    public String toString() {
        return "ShortUrl(id=" + this.getId() + ", url=" + this.getUrl() + ", slug=" + this.getSlug() + ", custom=" + this.getCustom() + ", userId=" + this.getUserId() + ", createdAt=" + this.getCreatedAt() + ", expiresAt=" + this.getExpiresAt() + ")";
    }

    public static class ShortUrlBuilder {
        private @NotNull ShortUrlId id;
        private @NotNull Url url;
        private @NotNull Slug slug;
        private @NotNull Boolean custom;
        private UserId userId;
        private @NotNull ZonedDateTime createdAt;
        private @NotNull ZonedDateTime expiresAt;

        ShortUrlBuilder() {
        }

        public ShortUrlBuilder id(@NotNull ShortUrlId id) {
            this.id = id;
            return this;
        }

        public ShortUrlBuilder url(@NotNull Url url) {
            this.url = url;
            return this;
        }

        public ShortUrlBuilder slug(@NotNull Slug slug) {
            this.slug = slug;
            return this;
        }

        public ShortUrlBuilder custom(@NotNull Boolean custom) {
            this.custom = custom;
            return this;
        }

        public ShortUrlBuilder userId(UserId userId) {
            this.userId = userId;
            return this;
        }

        public ShortUrlBuilder createdAt(@NotNull ZonedDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ShortUrlBuilder expiresAt(@NotNull ZonedDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public ShortUrl build() {
            return new ShortUrl(this.id, this.url, this.slug, this.custom, this.userId, this.createdAt, this.expiresAt);
        }

        public String toString() {
            return "ShortUrl.ShortUrlBuilder(id=" + this.id + ", url=" + this.url + ", slug=" + this.slug + ", custom=" + this.custom + ", userId=" + this.userId + ", createdAt=" + this.createdAt + ", expiresAt=" + this.expiresAt + ")";
        }
    }
}
