import React, { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { Title, Container, Text } from "@mantine/core";
import { useRouter } from "next/router";

import DashboardLayout from "@/pages/dashboard/_layout";
import { ContentTable } from "@/components/ContentTable";
import { useGetPastesQuery } from "@/hooks/queries/useGetPastesQuery";
import { useDeletePasteMutation } from "@/hooks/mutations/useDeletePasteMutation";
import { useGetStatsQuery } from "@/hooks/queries/useGetStatsQuery";

export default function Pastes() {
  const router = useRouter();
  const { data: statsData } = useGetStatsQuery();
  const { data, isLoading } = useGetPastesQuery({ page: router.query.page });
  const deletePaste = useDeletePasteMutation();

  if (isLoading || !statsData || !data) {
    return (
      <>
        <Title order={2}>Pastes</Title>
        <Container py={10} />
        <Text>Loading...</Text>
      </>
    );
  }

  const pageCount = Math.ceil(statsData.pastes.count / 10);
  const currentPage = Number(router.query.page) || 1;

  return (
    <>
      <Title order={2}>Pastes</Title>
      <Container py={10} />
      <ContentTable
        data={data}
        columns={[
          { label: "Content", type: "", key: "content" },
          { label: "Syntax", type: "", key: "syntax" },
          { label: "URL", type: "slug", key: "slug", path: "p" },
          { label: "Created at", type: "date", key: "createdAt" },
          {
            label: "Expiration time",
            type: "humanized-date",
            key: "expiresAt",
          },
        ]}
        paginationData={{
          total: pageCount,
          page: currentPage,
        }}
        deleteItem={deletePaste}
      />
    </>
  );
}

Pastes.getLayout = (page: ReactElement) => {
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
