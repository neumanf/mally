import React, { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconTrash,
} from "@tabler/icons";
import { UseMutationResult } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

interface TableSortProps<
  T extends Record<string, string | number>,
  K extends keyof T
> {
  data: T[];
  columns: {
    label: string;
    type: string;
    key: K;
  }[];
  deleteItem: UseMutationResult<any, unknown, any, unknown>;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData<T>(data: T[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => String(item[key]).toLowerCase().includes(query))
  );
}

function sortData<T>(
  data: T[],
  {
    sortBy,
    search,
    reversed,
  }: { sortBy: keyof T | null; reversed: boolean; search: string }
) {
  if (!sortBy) {
    return filterData(data, search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (reversed) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }

      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    }),
    search
  );
}

export function ContentTable<T extends Record<string, string | number>>({
  data,
  columns,
  deleteItem,
}: TableSortProps<T, string>) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof T) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const handleDeleteItem = (id: number) => {
    deleteItem.mutate(
      { id: id },
      {
        onSuccess: () =>
          setSortedData((data) => data.filter((d) => d.id !== id)),
        onError: () =>
          showNotification({
            title: "Something went wrong",
            message: "Error while trying to delete item",
            color: "red",
          }),
      }
    );
  };

  const rows = sortedData.map((row, i) => (
    <tr key={i}>
      {columns.map((c, j) => {
        const value = row[c.key];
        switch (c.type) {
          case "date":
            return <td key={j}>{new Date(value).toDateString()}</td>;
          case "url":
            return (
              <td key={j}>
                <Text
                  component="a"
                  href={value.toString()}
                  color="red"
                  lineClamp={1}
                >
                  {value}
                </Text>
              </td>
            );
          case "slug": {
            const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/p/${value}`;
            return (
              <td key={j}>
                <Text component="a" href={url} color="red" lineClamp={1}>
                  {url}
                </Text>
              </td>
            );
          }
          default:
            return (
              <td key={j}>
                <Text lineClamp={1}>{value}</Text>
              </td>
            );
        }
      })}
      <td style={{ display: "flex", justifyContent: "center", width: "20%" }}>
        <Tooltip label="Delete">
          <ActionIcon
            color="red"
            variant="light"
            loading={deleteItem.isLoading}
            onClick={() => handleDeleteItem(+row.id)}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Tooltip>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search"
        mb="md"
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        withBorder
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed", minWidth: 700 }}
      >
        <colgroup>
          {columns.map(
            (c, i) => i < columns.length && <col key={i} span={1} />
          )}
          <col span={1} style={{ width: "5%" }} />
        </colgroup>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <Th
                key={i}
                sorted={sortBy === c.toString()}
                reversed={reverseSortDirection}
                onSort={() => setSorting(c.key)}
              >
                {c.label}
              </Th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={3}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
