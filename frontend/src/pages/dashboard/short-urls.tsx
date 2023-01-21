import React, { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { Title, Container } from "@mantine/core";

import DashboardLayout from "@/pages/dashboard/_layout";
import { useGetShortUrlQuery } from "@/hooks/queries/useGetShortUrlsQuery";
import { ContentTable } from "@/components/ContentTable";

type ShortURLsProps = {
  accessToken: string;
};

export default function ShortURLs({ accessToken }: ShortURLsProps) {
  const { data, isLoading } = useGetShortUrlQuery({ accessToken });

  if (isLoading || !data) return <>Loading...</>;

  return (
    <>
      <Title order={2}>Short URLs</Title>
      <Container py={10} />
      <ContentTable
        data={data}
        columns={[
          { label: "Short URL", type: "url", key: "shortUrl" },
          { label: "URL", type: "url", key: "url" },
          { label: "Date", type: "date", key: "createdAt" },
        ]}
      />
    </>
  );
}

ShortURLs.getLayout = (page: ReactElement) => {
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
