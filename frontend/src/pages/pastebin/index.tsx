import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Group,
  Input,
  Tabs,
  Textarea,
  ScrollArea,
  Text,
  Transition,
  Select,
  Grid,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import { IconCheck, IconChevronDown } from "@tabler/icons";
import { GetServerSidePropsContext } from "next";
import { DateTime } from "luxon";

import { SYNTAX_LIST } from "@/constants/syntaxList";
import { useCreatePasteMutation } from "@/hooks/mutations/useCreatePasteMutation";
import { ApiError } from "@/api/request";
import { showNotification } from "@mantine/notifications";
import { Info } from "@/components/Info";
import { PageContainer } from "@/components/PageContainer";
import { changePageTitle } from "@/utils";

export default function Pastebin() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState<string | undefined>();
  const [syntax, setSyntax] = useState("text");
  const [expiration, setExpiration] = useState<string | null>("1 hours");
  const [pasteUrl, setPasteUrl] = useState("");

  const pastebin = useCreatePasteMutation();

  const handleSubmit = () => {
    let expiresAt: DateTime | undefined;
    if (expiration) {
      const [number, unit] = expiration.split(" ");
      expiresAt = DateTime.now().plus({ [unit]: number });
    }
    pastebin.mutate(
      { title, content, syntax, expiresAt },
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

  useEffect(() => {
    changePageTitle("Pastebin - Mally");
  }, []);

  return (
    <PageContainer title="Pastebin" height={800}>
      <Group grow>
        <Tabs defaultValue="content">
          <Tabs.List grow>
            <Tabs.Tab value="content">Content</Tabs.Tab>
            <Tabs.Tab value="preview">Preview</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="content" pt="xs">
            <Textarea
              placeholder="Enter the content"
              minRows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Tabs.Panel>

          <Tabs.Panel value="preview" pt="xs">
            {syntax === "text" ? (
              <ScrollArea h={450} style={{ whiteSpace: "pre-wrap" }}>
                {content}
              </ScrollArea>
            ) : (
              <ScrollArea h={450}>
                <Prism language={"tsx"} scrollAreaComponent="div">
                  {content}
                </Prism>
              </ScrollArea>
            )}
          </Tabs.Panel>
        </Tabs>
      </Group>
      <Container py={20} />
      <Grid grow>
        <Grid.Col span={3}>
          <Input.Wrapper label="Title">
            <Input
              placeholder="Enter a title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Input.Wrapper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Input.Wrapper label="Syntax" required>
            <Input
              component="select"
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
        </Grid.Col>
        <Grid.Col span={3}>
          <Select
            label="Expiration time"
            value={expiration}
            onChange={setExpiration}
            data={[
              { value: "1 hours", label: "1 hour" },
              { value: "1 days", label: "1 day" },
              { value: "1 weeks", label: "1 week" },
              { value: "1 months", label: "1 month" },
              { value: "", label: "No expiration" },
            ]}
          />
        </Grid.Col>
      </Grid>
      <Container py={10} />
      <Button onClick={handleSubmit} loading={pastebin.isLoading}>
        Submit
      </Button>
      <Transition
        mounted={!!pasteUrl}
        transition="fade"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <div style={styles}>
            <Info title="Paste URL" Icon={IconCheck} color="green">
              <Text component="a" href={pasteUrl} color="green">
                {pasteUrl}
              </Text>
            </Info>
          </div>
        )}
      </Transition>
    </PageContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!context.req.cookies.accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
}
