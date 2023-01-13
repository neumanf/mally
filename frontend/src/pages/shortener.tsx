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

type ShortUrlResponse = {
  short_url: string;
};

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  async function shortenUrl() {
    try {
      const data = await requestApi<ShortUrlResponse>(
        "/api/url-shortener",
        "POST",
        JSON.stringify({ url })
      );
      setShortUrl(data.short_url);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Container>
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
