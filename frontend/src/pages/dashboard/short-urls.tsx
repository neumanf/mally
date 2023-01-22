import React, { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { Title, Container } from "@mantine/core";

import DashboardLayout from "@/pages/dashboard/_layout";
import { useGetShortUrlQuery } from "@/hooks/queries/useGetShortUrlsQuery";
import { ContentTable } from "@/components/ContentTable";
import { useDeleteShortUrlMutation } from "@/hooks/mutations/useDeleteShortUrlMutation";

export default function ShortURLs() {
  const { data, isLoading } = useGetShortUrlQuery();
  const deleteShortUrl = useDeleteShortUrlMutation();

  return (
    <>
      <Title order={2}>Short URLs</Title>
      <Container py={10} />
      {isLoading || !data ? (
        <>Loading...</>
      ) : (
        <ContentTable
          data={data}
          columns={[
            { label: "Short URL", type: "url", key: "shortUrl" },
            { label: "URL", type: "url", key: "url" },
            { label: "Date", type: "date", key: "createdAt" },
          ]}
          deleteItem={deleteShortUrl}
        />
      )}
    </>
  );
}

ShortURLs.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

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
