import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  Container,
  Group,
  Input,
  Transition,
} from "@mantine/core";
import { IconCheck, IconLink } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { GetServerSidePropsContext } from "next";

import { ApiError } from "@/api/request";
import { useCreateShortUrlMutation } from "@/hooks/mutations";
import { Info } from "@/components/Info";
import { PageContainer } from "@/components/PageContainer";
import * as process from "process";
import { changePageTitle } from "@/utils";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const shortenUrl = useCreateShortUrlMutation();

  const handleShortenUrl = () => {
    shortenUrl.mutate(
      { url },
      {
        onSuccess: (data) => {
          const shortUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/s/${data.slug}`;
          setShortUrl(shortUrl);
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
    changePageTitle("URL Shortener - Mally");
  }, []);

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
      <Transition
        mounted={!!shortUrl}
        transition="fade"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <div style={styles}>
            <Info title={"Shortened URL"} Icon={IconCheck} color={"green"}>
              <Text component="a" href={shortUrl} color="green">
                {shortUrl}
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
