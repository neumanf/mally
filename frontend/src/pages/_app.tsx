import "./global.css";

import React, { ReactElement, ReactNode } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { Container, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";

import { HomeHeader } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NextPage } from "next";
import { AuthProvider } from "@/contexts/AuthProvider";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = (page: ReactElement) => (
    <>
      <HomeHeader />
      {Component.getLayout ? (
        Component.getLayout(page)
      ) : (
        <>
          <Container py={30} />
          {page}
          <Container py={100} />
          <Footer />
        </>
      )}
    </>
  );

  return (
    <>
      <Head>
        <title>Mally</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <AuthProvider>
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
              {getLayout(<Component {...pageProps} />)}
            </NotificationsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}
