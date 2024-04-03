import {
  createStyles,
  Navbar,
  UnstyledButton,
  Badge,
  Text,
  Group,
  ActionIcon,
  Button,
  SegmentedControl,
  Center,
  Tooltip,
  rem,
  ScrollArea,
} from "@mantine/core";

import router from "next/router";
import { useEffect, useState } from "react";
import { Edit, Plus, Bulb, Checkbox, Search, ArrowBarToLeft } from "tabler-icons-react";

import NewProject from "../Project/newProject";
import NewTeam from "../Team/newTeam";
import { UserButton } from "../UserButton";
import ProjectsList from "./projects";
import TeamsList from "./teams";
import { spotlight } from "@mantine/spotlight";
import { ProjectIcon } from "../Task/project";
import { TeamIcon } from "../Project/team";
import { usePlexoContext } from "context/PlexoContext";
import { IconSparkles } from "@tabler/icons-react";
import DesignProject from "../Project/DesignProject/designProject";

const useStyles = createStyles(theme => ({
  navbar: {
    paddingTop: 0,
  },

  section: {
    "&:not(:last-of-type)": {
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    },
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: rem(20),
    height: rem(20),
    pointerEvents: "none",
  },

  collections: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5),
  },

  collectionLink: {
    display: "block",
    padding: `${rem(8)} ${theme.spacing.xs}`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

const links = [
  { icon: Bulb, label: "Activity", notifications: 3 },
  { icon: Checkbox, label: "Tasks", link: "/tasks" },
  //   { icon: IconUser, label: "Contacts" },
];

type NavBarWithSearchProps = {
  openedNav: boolean;
  setOpenedNav: (value: boolean) => void;
  onNewTask?: () => void;
  setCollapseNavbar?: (collapseNavbar: boolean) => void;
};

export function NavbarSearch({
  onNewTask,
  openedNav,
  setOpenedNav,
  setCollapseNavbar,
}: NavBarWithSearchProps) {
  const { classes, theme } = useStyles();
  const [section, setSection] = useState<"projects" | "teams">("projects");
  const [newProjectOpened, setNewProjectOpened] = useState(false);
  const [designProjectOpened, setDesignProjectOpened] = useState(false);
  const [newTeamOpened, setNewTeamOpened] = useState(false);

  const { userData, isLoadingUser, plexoAPIEndpoint, authCookie } = usePlexoContext();

  const mainLinks = links.map(link => (
    <UnstyledButton
      key={link.label}
      className={classes.mainLink}
      onClick={() => link.link && router.push(link.link)}
    >
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} strokeWidth={1.5} />
        <Text size="sm">{link.label}</Text>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  useEffect(() => {
    const isShown = localStorage.getItem("modalShownBefore");
    if (!isShown && authCookie) {
      setDesignProjectOpened(true);
      localStorage.setItem("modalShownBefore", "true");
    }
  }, []);

  return (
    <>
      <NewProject newProjectOpened={newProjectOpened} setNewProjectOpened={setNewProjectOpened} />
      <DesignProject
        designProjectOpened={designProjectOpened}
        setDesignProjectOpened={setDesignProjectOpened}
      />
      <NewTeam newTeamOpened={newTeamOpened} setNewTeamOpened={setNewTeamOpened} />
      <Navbar
        width={{ sm: 300 }}
        hiddenBreakpoint="md"
        hidden={!openedNav}
        className={classes.navbar}
      >
        <Navbar.Section className={classes.section}>
          <UserButton
            logoutURL={`${plexoAPIEndpoint}/auth/logout`}
            user={userData}
            isLoadingUser={isLoadingUser}
            type="detail"
          />
        </Navbar.Section>

        <Navbar.Section className={classes.section} p="sm">
          <Group mb={"md"}>
            <Button
              leftIcon={<Edit strokeWidth={1.5} />}
              size="sm"
              onClick={onNewTask}
              sx={{ flexGrow: 1 }}
            >
              New Task
            </Button>
            <ActionIcon variant="default" size="lg" onClick={() => spotlight.open()}>
              <Search size={18} strokeWidth={1.5} />
            </ActionIcon>
          </Group>
          <div>{mainLinks}</div>
        </Navbar.Section>
        <Navbar.Section p="sm">
          <Group position="apart">
            <SegmentedControl
              size={"xs"}
              value={section}
              onChange={value => setSection(value as "projects" | "teams")}
              transitionTimingFunction="ease"
              data={[
                {
                  label: (
                    <Center>
                      <ProjectIcon />
                      <Text ml={6} size={"xs"}>
                        Projects
                      </Text>
                    </Center>
                  ),
                  value: "projects",
                },
                {
                  label: (
                    <Center>
                      <TeamIcon />
                      <Text ml={6} size={"xs"}>
                        Teams
                      </Text>
                    </Center>
                  ),
                  value: "teams",
                },
              ]}
            />
            <Tooltip label={section === "teams" ? "New team" : "New project"} position="top">
              <ActionIcon
                onClick={() =>
                  section === "teams" ? setNewTeamOpened(true) : setNewProjectOpened(true)
                }
              >
                <Plus size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Navbar.Section>
        <Navbar.Section className={classes.section} grow component={ScrollArea} p="xs" pt={0}>
          {section === "teams" ? <TeamsList /> : <ProjectsList />}
        </Navbar.Section>
        <Navbar.Section p="sm">
          <Group>
            <Button
              variant="default"
              leftIcon={
                <IconSparkles
                  size={16}
                  color={
                    theme.colorScheme === "dark" ? theme.colors.brand[4] : theme.colors.brand[6]
                  }
                />
              }
              onClick={() => setDesignProjectOpened(true)}
              styles={{
                root: {
                  flex: 1,
                },
                label: {
                  color:
                    theme.colorScheme === "dark" ? theme.colors.brand[4] : theme.colors.brand[6],
                },
              }}
            >
              Design your project
            </Button>
            {setCollapseNavbar ? (
              <ActionIcon size="lg" onClick={() => setCollapseNavbar(true)}>
                <ArrowBarToLeft size={18} />
              </ActionIcon>
            ) : null}
          </Group>
        </Navbar.Section>
      </Navbar>
    </>
  );
}
