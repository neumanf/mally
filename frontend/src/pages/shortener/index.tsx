import React, { useCallback, useState } from "react";
import {
  Text,
  Button,
  Container,
  Group,
  Input,
  Paper,
  Title,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck, IconLink } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

import { ApiError } from "@/api/request";
import { useCreateShortUrlMutation } from "@/hooks/mutations";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const shortenUrl = useCreateShortUrlMutation();

  const handleShortenUrl = useCallback(() => {
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
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    },
    []
  );

  return (
    <Container h={500}>
      <Title>URL Shortener</Title>
      <Container py={20} />
      <Group position="center">
        <Input
          icon={<IconLink />}
          placeholder="Enter the URL"
          size="lg"
          onChange={handleInputChange}
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
        <Paper radius="xs" p="lg" withBorder>
          <Group mb={5}>
            <ThemeIcon variant="light" color="green">
              <IconCheck />
            </ThemeIcon>
            <Text fw={700}>Shortened URL</Text>
          </Group>

          <Text component="a" href={shortUrl} color="green">
            {shortUrl}
          </Text>
        </Paper>
      )}
    </Container>
  );
}
