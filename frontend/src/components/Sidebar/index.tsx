import React, { useEffect, useState } from "react";
import { createStyles, Navbar } from "@mantine/core";
import {
  IconLogout,
  IconClipboard,
  IconLink,
  IconDashboard,
} from "@tabler/icons";
import { useRouter } from "next/router";

import { useLogoutMutation } from "@/hooks/mutations/useLogoutMutation";
import { showNotification } from "@mantine/notifications";
import useAuth from "@/hooks/useAuth";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

const data = [
  { link: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { link: "/dashboard/short-urls", label: "Short URLs", icon: IconLink },
  { link: "/dashboard/pastes", label: "Pastes", icon: IconClipboard },
];

export function Sidebar() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Dashboard");

  const { setUser } = useAuth();
  const router = useRouter();
  const logout = useLogoutMutation();

  useEffect(
    () => data.forEach((d) => router.asPath === d.link && setActive(d.label)),
    [router.asPath]
  );

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setUser(undefined);
        router.push("/");
      },
      onError: () =>
        showNotification({
          title: "Something went wrong",
          message:
            "An error occurred while trying to logout. Please try again.",
          color: "red",
        }),
    });
  };

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(e) => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <Navbar height="94vh" width={{ sm: 300 }} p="md">
      <Navbar.Section grow>{links}</Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a className={classes.link} onClick={handleLogout}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}
