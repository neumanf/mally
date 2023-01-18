import "./global.css";

import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";

import { HomeHeader } from "@/components/Header";
import { Footer } from "@/components/Footer";

const queryClient = new QueryClient();

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Maly</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "light",
            primaryColor: "red",
          }}
        >
          <NotificationsProvider>
            <HomeHeader />
            <Component {...pageProps} />
            <Footer />
          </NotificationsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}
