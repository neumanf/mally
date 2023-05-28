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
  Stack,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import { IconCheck, IconChevronDown } from "@tabler/icons";
import { GetServerSidePropsContext } from "next";

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
  const [pasteUrl, setPasteUrl] = useState("");

  const pastebin = useCreatePasteMutation();

  const handleSubmit = () => {
    pastebin.mutate(
      { title, content, syntax },
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
                <Prism
                  withLineNumbers
                  language={"tsx"}
                  scrollAreaComponent="div"
                >
                  {content}
                </Prism>
              </ScrollArea>
            )}
          </Tabs.Panel>
        </Tabs>
      </Group>
      <Container py={20} />
      <Stack>
        <Input.Wrapper label="Title">
          <Input
            placeholder="Enter a title"
            w={200}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Input.Wrapper>
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
      </Stack>
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
