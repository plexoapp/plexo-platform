import {
  Group,
  Stack,
  createStyles,
  MediaQuery,
  ActionIcon,
  Tabs,
  Switch,
  useMantineColorScheme,
} from "@mantine/core";
import { IconBuilding, IconMicroscope, IconUsers } from "@tabler/icons-react";
import { LayoutSidebar, Moon, Sun } from "tabler-icons-react";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

import { usePlexoContext } from "context/PlexoContext";
import { MembersSection } from "./Members";
import { OrganizationSection } from "./Organization";

export const SettingsPageContent = () => {
  const useStyles = createStyles(theme => ({
    burger: {
      [theme.fn.largerThan("sm")]: {
        display: "none",
      },
      [theme.fn.smallerThan("xs")]: {
        marginRight: -10,
      },
    },
    "text-view-buttons": {
      [theme.fn.smallerThan("sm")]: {
        display: "none",
      },
    },
    "text-header-buttons": {
      [theme.fn.smallerThan("sm")]: {
        fontSize: "90%",
      },
      [theme.fn.smallerThan("xs")]: {
        fontSize: "70%",
        marginRight: -15,
        marginLeft: -5,
      },
    },
    "icon-header-buttons": {
      [theme.fn.smallerThan("sm")]: {
        width: "90%",
        height: "90%",
      },
      [theme.fn.smallerThan("xs")]: {
        display: "none",
      },
    },
    "segmented-control": {
      [theme.fn.smallerThan("xs")]: {
        marginLeft: -5,
      },
    },
  }));

  const { theme } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { setNavBarOpened, membersData, isLoadingMembers, labelsData, isLoadingLabels } =
    usePlexoContext();
  const [newLabelOpened, setNewLabelOpened] = useState(false);
  const { pathname, query } = useRouter();
  const tab = query.tab as string;

  const labelsParsedData =
    labelsData?.map(label => ({
      id: label.id as string,
      name: label.name,
      color: label.color,
      createdAt: label.createdAt,
      description: label.description,
    })) ?? [];

  const membersParsedData =
    membersData?.map(member => ({
      id: member.id as string,
      name: member.name,
      email: member.email,
      role: member.role,
      avatar: member.photoUrl ?? "",
      job: member.role.toString(),
      createdAt: member.createdAt,
    })) ?? [];

  return (
    <Stack sx={{ flex: 1 }}>
      <Group
        h={73}
        position="apart"
        sx={{
          padding: theme.spacing.md,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          "&:not(:last-of-type)": {
            borderBottom: `1px solid ${
              theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
          },
        }}
      >
        <Group>
          <MediaQuery largerThan="md" styles={{ display: "none" }}>
            <ActionIcon onClick={() => setNavBarOpened(true)}>
              <LayoutSidebar size={16} />
            </ActionIcon>
          </MediaQuery>
          Settings
        </Group>

        <Switch
          onLabel={<Sun color={theme.white} size={18} />}
          offLabel={<Moon color={theme.colors.gray[6]} size={18} />}
          checked={colorScheme === "dark"}
          onChange={() => toggleColorScheme()}
          size="md"
        />
      </Group>

      <Stack
        spacing="sm"
        sx={theme => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        })}
        px={theme.spacing.md}
      >
        <Tabs defaultValue={tab}>
          <Tabs.List>
            <Link
              href={{ pathname: pathname, query: { ...query, tab: "organization" } }}
              style={{ textDecoration: "none" }}
            >
              <Tabs.Tab value="organization" icon={<IconBuilding size="0.8rem" />}>
                Organization
              </Tabs.Tab>
            </Link>
            <Link
              href={{ pathname: pathname, query: { ...query, tab: "members" } }}
              style={{ textDecoration: "none" }}
            >
              <Tabs.Tab value="members" icon={<IconUsers size="0.8rem" />}>
                Members
              </Tabs.Tab>
            </Link>

            <Link
              href={{ pathname: pathname, query: { ...query, tab: "experimental" } }}
              style={{ textDecoration: "none" }}
            >
              <Tabs.Tab value="experimental" icon={<IconMicroscope size="0.8rem" />}>
                Experimental
              </Tabs.Tab>
            </Link>
          </Tabs.List>

          <Tabs.Panel value="organization" pt="xl">
            <OrganizationSection />
          </Tabs.Panel>

          <Tabs.Panel value="members" pt="xl">
            <MembersSection data={membersParsedData} />
          </Tabs.Panel>

          <Tabs.Panel value="experimental" pt="xl">
            Experimental features
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Stack>
  );
};
