import React, { useState } from "react";
import { Text, Button, Container, Group, Input } from "@mantine/core";
import { IconCheck, IconLink } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

import { ApiError } from "@/api/request";
import { useCreateShortUrlMutation } from "@/hooks/mutations";
import { Info } from "@/components/Info";
import { PageContainer } from "@/components/PageContainer";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const shortenUrl = useCreateShortUrlMutation();

  const handleShortenUrl = () => {
    shortenUrl.mutate(
      { url },
      {
        onSuccess: (data) => {
          setShortUrl(data.short_url);
        },
        onError: (error) => {
          const message =
            error instanceof ApiError && error.statusCode === 400
              ? error.message
              : "An unexpected error occurred.";

          showNotification({
            title: "Something went wrong.",
            message: message,
            color: "red",
          });
        },
      }
    );
  };

  return (
    <PageContainer title="URL Shortener">
      <Group position="center">
        <Input
          icon={<IconLink />}
          placeholder="Enter the URL"
          size="lg"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          size="lg"
          onClick={handleShortenUrl}
          loading={shortenUrl.isLoading}
        >
          Shorten
        </Button>
      </Group>
      <Container py={20} />
      {shortUrl && (
        <Info title={"Shortened URL"} Icon={IconCheck} color={"green"}>
          <Text component="a" href={shortUrl} color="green">
            {shortUrl}
          </Text>
        </Info>
      )}
    </PageContainer>
  );
}
