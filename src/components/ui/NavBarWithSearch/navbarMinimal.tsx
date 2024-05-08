import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  createStyles,
  Navbar,
  Menu,
  ScrollArea,
} from "@mantine/core";

import { usePlexoContext } from "context/PlexoContext";
import { UserButton } from "../UserButton";
import {
  Affiliate,
  ArrowBarRight,
  Edit,
  Icon,
  LayoutGrid,
  MessageCircle2,
  Search,
  Checkbox,
  Plus,
} from "tabler-icons-react";
import { IconSparkles } from "@tabler/icons-react";
import { spotlight } from "@mantine/spotlight";
import router from "next/router";
import { ProjectMenuList } from "./projects";
import { TeamsMenuList } from "./teams";

const useStyles = createStyles(theme => ({
  navbar: {
    width: rem(80),
    padding: theme.spacing.md,
    display: "flex",
    flexDirection: "column",
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  navbarMain: {
    flex: 1,
    marginTop: rem(50),
  },
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.sm,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },
  hideNavbar: {
    display: "none",
  },
}));

interface NavbarLinkProps {
  icon: Icon;
  label: string;
  onClick?(): void;
  color?: string | undefined;
}

function NavbarLink({ icon: Icon, label, onClick, color }: NavbarLinkProps) {
  const { classes } = useStyles();
  return (
    <Tooltip label={label} position="right" /* transitionProps={{ duration: 0 }} */>
      <UnstyledButton onClick={onClick} className={classes.link}>
        <Icon style={{ width: rem(20), height: rem(20) }} strokeWidth={1.5} color={color} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function NavbarMinimal({
  setCollapseNavbar,
  openedNav,
}: {
  setCollapseNavbar: (collapseNavbar: boolean) => void;
  openedNav: boolean;
}) {
  const { classes, theme } = useStyles();

  const {
    userData,
    isLoadingUser,
    plexoAPIEndpoint,
    setChatOpened,
    setNewTaskOpened,
    setNavBarOpened,
    setDesignProjectOpened,
    setNewProjectOpened,
    setNewTeamOpened,
  } = usePlexoContext();

  return (
    <Navbar
      width={{ md: 80, lg: 80 }}
      hiddenBreakpoint="md"
      hidden={!openedNav}
      className={classes.navbar}
    >
      <Center>
        <UserButton
          logoutURL={`${plexoAPIEndpoint}/auth/logout`}
          user={userData}
          isLoadingUser={isLoadingUser}
          type="icon"
          menuPosition="right-start"
        />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" spacing={0}>
          <NavbarLink
            icon={Edit}
            label="New task"
            color={theme.colorScheme === "dark" ? theme.colors.brand[4] : theme.colors.brand[6]}
            onClick={() => {
              setNewTaskOpened(true);
              setNavBarOpened(false);
            }}
          />
          <NavbarLink icon={Search} label="Search" onClick={() => spotlight.open()} />
          <NavbarLink icon={Checkbox} label="Tasks" onClick={() => router.push("/tasks")} />

          <Menu position="right-start">
            <Menu.Target>
              <Tooltip label="Projects" position="right">
                <UnstyledButton className={classes.link}>
                  <LayoutGrid style={{ width: rem(20), height: rem(20) }} strokeWidth={1.5} />
                </UnstyledButton>
              </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => setNewProjectOpened(true)} icon={<Plus size={16} />}>
                New Project
              </Menu.Item>

              <ScrollArea.Autosize mah={250}>
                <Menu.Label>Projects</Menu.Label>
                <ProjectMenuList />
              </ScrollArea.Autosize>
            </Menu.Dropdown>
          </Menu>

          <Menu position="right-start">
            <Menu.Target>
              <Tooltip label="Teams" position="right">
                <UnstyledButton className={classes.link}>
                  <Affiliate style={{ width: rem(20), height: rem(20) }} strokeWidth={1.5} />
                </UnstyledButton>
              </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => setNewTeamOpened(true)} icon={<Plus size={16} />}>
                New Team
              </Menu.Item>

              <ScrollArea.Autosize mah={250}>
                <Menu.Label>Teams</Menu.Label>
                <TeamsMenuList />
              </ScrollArea.Autosize>
            </Menu.Dropdown>
          </Menu>
        </Stack>
      </div>

      <Stack justify="center" spacing={0}>
        <NavbarLink
          icon={IconSparkles}
          label="Design your Project"
          color={theme.colorScheme === "dark" ? theme.colors.brand[4] : theme.colors.brand[6]}
          onClick={() => setDesignProjectOpened(true)}
        />

        <NavbarLink icon={ArrowBarRight} label="Expand" onClick={() => setCollapseNavbar(false)} />
      </Stack>
    </Navbar>
  );
}
