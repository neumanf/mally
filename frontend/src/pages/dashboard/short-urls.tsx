import React, { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { Title, Container, Text } from "@mantine/core";
import { useRouter } from "next/router";

import DashboardLayout from "@/pages/dashboard/_layout";
import { useGetShortUrlQuery } from "@/hooks/queries/useGetShortUrlsQuery";
import { ContentTable } from "@/components/ContentTable";
import { useDeleteShortUrlMutation } from "@/hooks/mutations/useDeleteShortUrlMutation";
import { useGetStatsQuery } from "@/hooks/queries/useGetStatsQuery";

export default function ShortURLs() {
  const router = useRouter();
  const { data: statsData } = useGetStatsQuery();
  const { data, isLoading } = useGetShortUrlQuery({ page: router.query.page });
  const deleteShortUrl = useDeleteShortUrlMutation();

  if (isLoading || !statsData || !data) {
    return (
      <>
        <Title order={2}>Short URLs</Title>
        <Container py={10} />
        <Text>Loading...</Text>
      </>
    );
  }

  const pageCount = Math.ceil(statsData.urls.count / 10);
  const currentPage = Number(router.query.page) || 1;

  return (
    <>
      <Title order={2}>Short URLs</Title>
      <Container py={10} />
      <ContentTable
        data={data}
        columns={[
          { label: "Short URL slug", type: "slug", key: "slug", path: "s" },
          { label: "URL", type: "url", key: "url" },
          { label: "Date", type: "date", key: "createdAt" },
        ]}
        deleteItem={deleteShortUrl}
        paginationData={{
          total: pageCount,
          page: currentPage,
        }}
      />
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
