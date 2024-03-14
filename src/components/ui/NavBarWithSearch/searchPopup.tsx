import { Center, Group, Text, UnstyledButton, createStyles, rem } from "@mantine/core";
import { SpotlightActionProps, SpotlightProvider } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { usePlexoContext } from "context/PlexoContext";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { StatusIcon } from "../Task/status";
import { DateLabel } from "lib/utils";

const useStyles = createStyles(theme => ({
  action: {
    position: "relative",
    display: "block",
    width: "100%",
    padding: `${rem(10)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
    }),

    "&[data-hovered]": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
    },
  },
}));

const CustomAction = ({ action, hovered, onTrigger }: SpotlightActionProps) => {
  const { classes, theme } = useStyles();

  return (
    <UnstyledButton
      className={classes.action}
      data-hovered={hovered || undefined}
      tabIndex={-1}
      onMouseDown={event => event.preventDefault()}
      onClick={onTrigger}
    >
      <Group spacing={"xs"}>
        <Center w={28} h={28}>
          {StatusIcon(theme, action.status)}
        </Center>
        <Text size={"sm"} sx={{ flexGrow: 1 }}>
          {action.title}
        </Text>
        <Text lineClamp={1} size={"xs"} color={"dimmed"}>
          {DateLabel(action.createdDate)}
        </Text>
      </Group>
    </UnstyledButton>
  );
};

const MySpotlightProvider = ({ children }: { children: ReactNode }) => {
  const { tasks } = usePlexoContext();
  const router = useRouter();

  const actions = tasks
    ? tasks
        .map(t => {
          return {
            id: t.id,
            title: t.title,
            /* description: t.description || "", */
            onTrigger: () => router.push(`/tasks/${t.id}`),
            group: "tasks",
            status: t.status,
            priority: t.priority,
            createdDate: t.createdAt,
          };
        })
        .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
    : [];

  return (
    <SpotlightProvider
      actions={actions}
      actionComponent={CustomAction}
      searchIcon={<IconSearch size={18} />}
      searchPlaceholder="Search..."
      nothingFoundMessage="Nothing found..."
    >
      {children}
    </SpotlightProvider>
  );
};

export default MySpotlightProvider;
