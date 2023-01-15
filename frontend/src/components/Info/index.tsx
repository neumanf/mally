import React, { ReactNode } from "react";
import { Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { TablerIcon } from "@tabler/icons";

type InfoProps = {
  title: string;
  Icon: TablerIcon;
  color: string;
  children: ReactNode;
};

export function Info({ title, Icon, color, children }: InfoProps) {
  return (
    <Paper radius="xs" p="lg" mt={20} withBorder>
      <Group mb={5}>
        <ThemeIcon variant="light" color={color}>
          <Icon />
        </ThemeIcon>
        <Text fw={700}>{title}</Text>
      </Group>

      {children}
    </Paper>
  );
}
