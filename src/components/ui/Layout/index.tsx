import {
  ActionIcon,
  AppShell,
  Aside,
  Box,
  Burger,
  CloseButton,
  createStyles,
  Drawer,
  Footer,
  Group,
  Header,
  MediaQuery,
  Navbar,
  ScrollArea,
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

  const [opened, setOpened] = useState(false);
  const [openedAside, setOpenedAside] = useState(false);

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
        styles={{
          main: {
            /* paddingLeft:0, */
            background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        }}
        layout="alt"
        navbarOffsetBreakpoint="md"
        asideOffsetBreakpoint="md"
        navbar={
          <Navbar p="md" hiddenBreakpoint="md" hidden={!opened} width={{ md: 350, lg: 350 }}>
            <Navbar.Section mt="xs">
              <Text>Application navbar</Text>
              <MediaQuery largerThan="md" styles={{ display: "none" }}>
                <CloseButton aria-label="Close modal" onClick={() => setOpened(o => !o)} />
              </MediaQuery>
            </Navbar.Section>
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
            </Navbar.Section>

            <Navbar.Section>
              <Text>Application sidebar</Text>
            </Navbar.Section>
          </Navbar>
        }
        aside={
          <Aside p="md" hiddenBreakpoint="md" hidden={!openedAside} width={{ md: 300, lg: 300 }}>
            <Aside.Section mt="xs">
              <Text>Application sidebar</Text>
              <MediaQuery largerThan="md" styles={{ display: "none" }}>
                <CloseButton aria-label="Close modal" onClick={() => setOpenedAside(o => !o)} />
              </MediaQuery>
            </Aside.Section>

            <Aside.Section grow component={ScrollArea} mx="-xs" px="xs">
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
              <Box py={80}>
                <Text>Application sidebar</Text>
              </Box>
            </Aside.Section>

            <Aside.Section>
              <Text>Application sidebar</Text>
            </Aside.Section>
          </Aside>
        }
        /* footer={
          <Footer height={60} p="md">
            Application footer
          </Footer>
        } */
        header={
          <Header height={{ base: 50, md: 70 }} p="md">
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <MediaQuery largerThan="md" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened(o => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text>Application header</Text>
              <MediaQuery largerThan="md" styles={{ display: "none" }}>
                <Burger
                  opened={openedAside}
                  onClick={() => setOpenedAside(o => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
            </div>
          </Header>
        }
      >
        {children}
      </AppShell>

      {/* <AppShell
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
      </AppShell> */}
    </>
  );
};

export default Layout;
