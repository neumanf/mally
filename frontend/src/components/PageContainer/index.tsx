import { Container, Title } from "@mantine/core";
import React, { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  height?: number;
  children: ReactNode;
};

export function PageContainer({ title, height, children }: PageContainerProps) {
  return (
    <Container h={height ?? 500}>
      <Title>{title}</Title>
      <Container py={20} />
      {children}
    </Container>
  );
}
