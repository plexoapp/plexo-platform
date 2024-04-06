import { AppShell, createStyles, Drawer, Group, Text, ActionIcon } from "@mantine/core";
import { ReactNode, useEffect } from "react";

import { NavbarSearch } from "components/ui/NavBarWithSearch";
import NewTask from "components/ui/Task/newTask";
import { usePlexoContext } from "../../../context/PlexoContext";
import { IconMessageCircle } from "@tabler/icons-react";

interface LayoutProps {
  children: ReactNode;
  title?: String;
}

const useStyles = createStyles(theme => ({
  drawer: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));

const Layout = ({ children, title }: LayoutProps) => {
  const { classes, theme } = useStyles();
  const {
    navBarOpened,
    setNavBarOpened,
    newTaskOpened,
    setNewTaskOpened,
    createMoreTasks,
    setCreateMoreTasks,
  } = usePlexoContext();

  useEffect(() => {
    if (!newTaskOpened && createMoreTasks) {
      setNewTaskOpened(true);
    }
  }, [newTaskOpened, createMoreTasks]);

  return (
    <>
      <NewTask
        newTaskOpened={newTaskOpened}
        setNewTaskOpened={setNewTaskOpened}
        createMore={createMoreTasks}
        setCreateMore={setCreateMoreTasks}
      />
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
          setOpenedNav={setNavBarOpened}
        />
      </Drawer>
      <AppShell
        fixed
        padding={0}
        navbarOffsetBreakpoint="md"
        navbar={
          <NavbarSearch
            onNewTask={() => {
              setNewTaskOpened(true);
              setNavBarOpened(false);
            }}
            openedNav={false}
            setOpenedNav={() => true}
          />
        }
        styles={theme => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        })}
      >
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
          <Group pl="md">
            <Text size={"lg"}>{title}</Text>
          </Group>
          <Group>
            <ActionIcon variant="filled" color="#09AB7A">
              <IconMessageCircle size={16} color="white" />
            </ActionIcon>
          </Group>
        </Group>

        {children}
      </AppShell>
    </>
  );
};

export default Layout;
