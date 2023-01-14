import React, { useState } from "react";
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

import { requestApi } from "@/helpers/requestApi";
import { showNotification } from "@mantine/notifications";

type ShortUrlResponse = {
  short_url: string;
};
type ErrorResponse = {
  statusCode: 400;
  message: string[];
  error: string;
};

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  async function shortenUrl() {
    try {
      const data = await requestApi<Partial<ShortUrlResponse & ErrorResponse>>(
        "/api/url-shortener",
        "POST",
        JSON.stringify({ url })
      );

      if (data?.statusCode === 400) {
        showNotification({
          title: "Something went wrong.",
          message: data?.message?.join(",") ?? "",
          color: "red",
        });
      }

      if (data.short_url) setShortUrl(data.short_url);
    } catch (e) {
      showNotification({
        title: "Something went wrong",
        message: "An unexpected error occurred.",
        color: "red",
      });
    }
  }

  return (
    <Container h={500}>
      <Title>URL Shortener</Title>
      <Container py={20} />
      <Group position="center">
        <Input
          icon={<IconLink />}
          placeholder="Enter the URL"
          size="lg"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button size="lg" onClick={shortenUrl}>
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
