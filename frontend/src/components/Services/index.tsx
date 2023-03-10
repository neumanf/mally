import {
  ThemeIcon,
  Text,
  Title,
  Container,
  SimpleGrid,
  createStyles,
  Stack,
} from "@mantine/core";
import { IconClipboard, IconClock, IconLink, TablerIcon } from "@tabler/icons";

export const DATA = [
  {
    icon: IconLink,
    title: "URL Shortening",
    link: "/shortener",
    description: "Reduce massive links into a short, comprehensive link.",
  },
  {
    icon: IconClipboard,
    title: "Pastebin",
    link: "/pastebin",
    description: "Share any text or code over the web with ease.",
  },
  {
    icon: IconClock,
    title: "And more",
    description: "Coming soon...",
  },
];

interface FeatureProps {
  icon: TablerIcon;
  title: React.ReactNode;
  link?: string;
  description: React.ReactNode;
}

export function Feature({
  icon: Icon,
  title,
  link,
  description,
}: FeatureProps) {
  return (
    <Stack>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon size={20} stroke={1.5} />
      </ThemeIcon>
      <Text component="a" href={link}>
        {title}
      </Text>
      <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
        {description}
      </Text>
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: 28,
      textAlign: "left",
    },
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      textAlign: "left",
    },
  },
}));

interface FeaturesGridProps {
  title: React.ReactNode;
  description: React.ReactNode;
  data?: FeatureProps[];
}

export function ServicesGrid({
  title,
  description,
  data = DATA,
}: FeaturesGridProps) {
  const { classes, theme } = useStyles();
  const features = data.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <Container id="services" className={classes.wrapper}>
      <Title className={classes.title}>{title}</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          {description}
        </Text>
      </Container>

      <SimpleGrid
        mt={60}
        cols={3}
        spacing={theme.spacing.xl * 2}
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: "xl" },
          { maxWidth: 755, cols: 1, spacing: "xl" },
        ]}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}
