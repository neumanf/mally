import React from "react";
import { Button, Container, Group, Input, Title } from "@mantine/core";
import { IconLink } from "@tabler/icons";

export default function UrlShortner() {
  return (
    <Container>
      <Title>URL Shortener</Title>
      <Group position="center">
        <Input icon={<IconLink />} placeholder="Enter the URL" size="md" />
        <Button>Shorten</Button>
      </Group>
    </Container>
  );
}
