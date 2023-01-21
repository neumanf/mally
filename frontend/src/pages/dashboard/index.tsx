import { GetServerSidePropsContext } from "next";
import React, { ReactElement } from "react";
import {
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconClipboard,
  IconLink,
  TablerIcon,
} from "@tabler/icons";

import DashboardLayout from "@/pages/dashboard/_layout";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: theme.spacing.xl * 1.5,
    paddingBottom: theme.spacing.xl * 1.5,
  },

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

type DashboardProps = {
  accessToken: string;
};

type StatsData = {
  title: string;
  icon: TablerIcon;
  value: number;
  diff?: number;
}[];

const statsData: StatsData = [
  { title: "Total short URLs", icon: IconLink, value: 12 },
  { title: "Total pastes", icon: IconClipboard, value: 23 },
];

export default function Dashboard({ accessToken }: DashboardProps) {
  const { classes } = useStyles();
  const stats = statsData.map((stat) => {
    const Icon = stat.icon;
    const DiffIcon =
      stat.diff && stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          {stat.diff && (
            <Text
              color={stat.diff > 0 ? "teal" : "red"}
              size="sm"
              weight={500}
              className={classes.diff}
            >
              <span>{stat.diff}%</span>
              <DiffIcon size={16} stroke={1.5} />
            </Text>
          )}
        </Group>
        {stat.diff && (
          <Text size="xs" color="dimmed" mt={7}>
            Compared to previous month
          </Text>
        )}
      </Paper>
    );
  });

  return (
    <>
      <Title order={2}>Dashboard</Title>
      <div className={classes.root}>
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "xs", cols: 1 },
          ]}
        >
          {stats}
        </SimpleGrid>
      </div>
    </>
  );
}

Dashboard.getLayout = (page: ReactElement) => {
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
