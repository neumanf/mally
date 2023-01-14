import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";

import { HomeHeader } from "@/components/Header";
import { Footer } from "@/components/Footer";
import React from "react";

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

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          primaryColor: "red",
        }}
      >
        <HomeHeader
          links={[
            {
              link: "",
              label: "Services",
              links: [
                {
                  link: "/shortener",
                  label: "URL Shortner",
                },
              ],
            },
          ]}
        />
        <Component {...pageProps} />
        <Footer
          data={[
            {
              title: "Home",
              links: [
                { label: "Services", link: "http://localhost:3000/#services" },
              ],
            },
          ]}
        />
      </MantineProvider>
    </>
  );
}
