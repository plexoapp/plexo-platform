import { AppShell, createStyles, Drawer, Group } from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";

import { NavbarSearch } from "components/ui/NavBarWithSearch";
import NewTask from "components/ui/Task/newTask";
import { usePlexoContext } from "../../../context/PlexoContext";
import { NavbarMinimal } from "../NavBarWithSearch/navbarMinimal";
import Chat from "../Chat";

interface LayoutProps {
  children: ReactNode;
}

const useStyles = createStyles(theme => ({
  drawer: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));

const Layout = ({ children }: LayoutProps) => {
  const { classes } = useStyles();
  const {
    navBarOpened,
    setNavBarOpened,
    newTaskOpened,
    setNewTaskOpened,
    createMoreTasks,
    setCreateMoreTasks,
    chatOpened,
  } = usePlexoContext();

  const [collapseNavbar, setCollapseNavbar] = useState(false);

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
          collapseNavbar ? (
            <NavbarMinimal setCollapseNavbar={setCollapseNavbar} openedNav={false} />
          ) : (
            <NavbarSearch
              onNewTask={() => {
                setNewTaskOpened(true);
                setNavBarOpened(false);
              }}
              openedNav={false}
              setOpenedNav={() => true}
              setCollapseNavbar={setCollapseNavbar}
            />
          )
        }
        aside={chatOpened ? <Chat /> : undefined}
        styles={theme => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        })}
      >
        <Group spacing={0}>{children}</Group>
      </AppShell>
    </>
  );
};

export default Layout;
