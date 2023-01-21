import React, { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { Title, Container } from "@mantine/core";

import DashboardLayout from "@/pages/dashboard/_layout";
import { ContentTable } from "@/components/ContentTable";
import { useGetPastesQuery } from "@/hooks/queries/useGetPastesQuery";

type PastesProps = {
  accessToken: string;
};

export default function Pastes({ accessToken }: PastesProps) {
  const { data, isLoading } = useGetPastesQuery({ accessToken });

  if (isLoading || !data) return <>Loading...</>;

  return (
    <>
      <Title order={2}>Pastes</Title>
      <Container py={10} />
      <ContentTable
        data={data}
        columns={[
          { label: "Content", type: "", key: "content" },
          { label: "Syntax", type: "", key: "syntax" },
          { label: "URL", type: "slug", key: "slug" },
          { label: "Date", type: "date", key: "createdAt" },
        ]}
      />
    </>
  );
}

Pastes.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const accessToken = context.req.cookies.accessToken;
  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: { accessToken },
  };
}
