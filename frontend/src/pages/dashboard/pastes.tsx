import React, { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { Title, Container } from "@mantine/core";

import DashboardLayout from "@/pages/dashboard/_layout";
import { ContentTable } from "@/components/ContentTable";
import { useGetPastesQuery } from "@/hooks/queries/useGetPastesQuery";
import { useDeletePasteMutation } from "@/hooks/mutations/useDeletePasteMutation";

export default function Pastes() {
  const { data, isLoading } = useGetPastesQuery();
  const deletePaste = useDeletePasteMutation();

  return (
    <>
      <Title order={2}>Pastes</Title>
      <Container py={10} />
      {isLoading || !data ? (
        <>Loading...</>
      ) : (
        <ContentTable
          data={data}
          columns={[
            { label: "Content", type: "", key: "content" },
            { label: "Syntax", type: "", key: "syntax" },
            { label: "URL", type: "slug", key: "slug" },
            { label: "Date", type: "date", key: "createdAt" },
          ]}
          deleteItem={deletePaste}
        />
      )}
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
