import React, { useCallback, useState } from "react";
import {
  Button,
  Container,
  Group,
  Input,
  Tabs,
  Textarea,
  Title,
  ScrollArea,
  Paper,
  ThemeIcon,
  Text,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import { IconCheck, IconChevronDown } from "@tabler/icons";

import { SYNTAX_LIST } from "@/pages/pastebin/syntaxList";
import { useCreatePasteMutation } from "@/hooks/mutations/useCreatePasteMutation";
import { ApiError } from "@/api/request";
import { showNotification } from "@mantine/notifications";

export default function Pastebin() {
  const [content, setContent] = useState("");
  const [syntax, setSyntax] = useState("text");
  const [pasteUrl, setPasteUrl] = useState("");

  const pastebin = useCreatePasteMutation();

  const handleSubmit = () => {
    pastebin.mutate(
      { content, syntax },
      {
        onSuccess: (data) => {
          setPasteUrl(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/p/${data.slug}`);
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
    <>
      <Container h={600}>
        <Title>Pastebin</Title>
        <Container py={20} />
        <Group grow>
          <Tabs defaultValue="content">
            <Tabs.List grow>
              <Tabs.Tab value="content">Content</Tabs.Tab>
              <Tabs.Tab value="preview">Preview</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="content" pt="xs">
              <Textarea
                placeholder="Your paste"
                minRows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Tabs.Panel>

            <Tabs.Panel value="preview" pt="xs">
              {syntax === "text" ? (
                <ScrollArea h={239} style={{ whiteSpace: "pre-wrap" }}>
                  {content}
                </ScrollArea>
              ) : (
                <Prism language={"tsx"}>{content}</Prism>
              )}
            </Tabs.Panel>
          </Tabs>
        </Group>
        <Container py={20} />
        <Group>
          <Input.Wrapper label="Syntax" required>
            <Input
              component="select"
              w={200}
              rightSection={<IconChevronDown size={14} stroke={1.5} />}
              onChange={(e) => setSyntax(e.target.value)}
            >
              {SYNTAX_LIST.map((syntax) => (
                <option key={syntax} value={syntax}>
                  {syntax}
                </option>
              ))}
            </Input>
          </Input.Wrapper>
        </Group>
        <Container py={10} />
        <Button onClick={handleSubmit} loading={pastebin.isLoading}>
          Submit
        </Button>
        {pasteUrl && (
          <Paper radius="xs" p="lg" mt={20} withBorder>
            <Group mb={5}>
              <ThemeIcon variant="light" color="green">
                <IconCheck />
              </ThemeIcon>
              <Text fw={700}>Paste URL</Text>
            </Group>

            <Text component="a" href={pasteUrl} color="green">
              {pasteUrl}
            </Text>
          </Paper>
        )}
      </Container>
    </>
  );
}
