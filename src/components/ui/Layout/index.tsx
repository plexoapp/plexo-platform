import {
  ActionIcon,
  AppShell,
  createStyles,
  Drawer,
  Group,
  MediaQuery,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";

import { NavbarSearch } from "components/ui/NavBarWithSearch";
import NewTask from "components/ui/Task/newTask";
import { usePlexoContext } from "../../../context/PlexoContext";
import { NavbarMinimal } from "../NavBarWithSearch/navbarMinimal";
import Chat from "../Chat";
import DesignProject from "../Project/DesignProject/designProject";
import NewProject from "../Project/newProject";
import NewTeam from "../Team/newTeam";
import { LayoutSidebar, MessageCircle2 } from "tabler-icons-react";

const useStyles = createStyles(theme => ({
  drawer: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));

interface LayoutProps {
  children: ReactNode;
  button?: ReactNode;
  pageTitle?: string;
}

const Layout = ({ pageTitle, button, children }: LayoutProps) => {
  const { classes, theme } = useStyles();
  const {
    navBarOpened,
    setNavBarOpened,
    newTaskOpened,
    setNewTaskOpened,
    createMoreTasks,
    setCreateMoreTasks,
    chatOpened,
    designProjectOpened,
    setDesignProjectOpened,
    newProjectOpened,
    setNewProjectOpened,
    newTeamOpened,
    setNewTeamOpened,
    setChatOpened,
  } = usePlexoContext();

  const [collapseNavbar, setCollapseNavbar] = useState(false);

  useEffect(() => {
    if (!newTaskOpened && createMoreTasks) {
      setNewTaskOpened(true);
    }
  }, [newTaskOpened, createMoreTasks]);

  return (
    <>
      <DesignProject
        designProjectOpened={designProjectOpened}
        setDesignProjectOpened={setDesignProjectOpened}
      />
      <NewTask
        newTaskOpened={newTaskOpened}
        setNewTaskOpened={setNewTaskOpened}
        createMore={createMoreTasks}
        setCreateMore={setCreateMoreTasks}
      />
      <NewProject newProjectOpened={newProjectOpened} setNewProjectOpened={setNewProjectOpened} />

      <NewTeam newTeamOpened={newTeamOpened} setNewTeamOpened={setNewTeamOpened} />
      <Drawer
        size={300}
        padding={0}
        className={classes.drawer}
        opened={navBarOpened}
        onClose={() => setNavBarOpened(false)}
        withCloseButton={false}
        sx={theme => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        })}
      >
        <NavbarSearch
          onNewTask={() => {
            setNewTaskOpened(true);
            setNavBarOpened(false);
          }}
          openedNav={navBarOpened}
        />
      </Drawer>

      <Drawer
        size={350}
        padding={0}
        position="right"
        className={classes.drawer}
        opened={chatOpened}
        onClose={() => setChatOpened(false)}
        withCloseButton={false}
        sx={theme => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        })}
      >
        <Chat chatOpened={chatOpened} />
      </Drawer>

      <AppShell
        fixed
        padding={0}
        navbarOffsetBreakpoint="md"
        asideOffsetBreakpoint="md"
        navbar={
          collapseNavbar ? (
            <NavbarMinimal setCollapseNavbar={setCollapseNavbar} openedNav={false} />
          ) : (
            <NavbarSearch
              onNewTask={() => {
                setNewTaskOpened(true);
                setNavBarOpened(false);
              }}
              openedNav={false}
              setCollapseNavbar={setCollapseNavbar}
            />
          )
        }
        aside={chatOpened ? <Chat chatOpened={false} /> : undefined}
        styles={theme => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        })}
      >
        <Stack spacing={0}>
          <Group
            p={"md"}
            h={73}
            position="apart"
            sx={{
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
              <Group>
                {button}
                <Text>{pageTitle}</Text>
              </Group>
            </Group>

            <Group>
              <Tooltip label="Chat with Plexo">
                <ActionIcon
                  variant="filled"
                  color="brand"
                  onClick={() => setChatOpened(!chatOpened)}
                >
                  <MessageCircle2 size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
          {children}
        </Stack>
      </AppShell>
    </>
  );
};

export default Layout;
