import { Center, Tooltip, UnstyledButton, Stack, rem, createStyles, Navbar } from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import { usePlexoContext } from "context/PlexoContext";
import { UserButton } from "../UserButton";

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
  icon: typeof IconHome2;
  label: string;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, onClick }: NavbarLinkProps) {
  const { classes } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link}>
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home" },
  { icon: IconGauge, label: "Dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics" },
  { icon: IconCalendarStats, label: "Releases" },
  { icon: IconUser, label: "Account" },
  { icon: IconFingerprint, label: "Security" },
  { icon: IconSettings, label: "Settings" },
];

export function NavbarMinimal({
  setCollapseNavbar,
  openedNav,
}: {
  setCollapseNavbar: (collapseNavbar: boolean) => void;
  openedNav: boolean;
}) {
  const { classes } = useStyles();

  const { userData, isLoadingUser, plexoAPIEndpoint } = usePlexoContext();

  const links = mockdata.map((link, index) => (
    <NavbarLink {...link} key={link.label} /* onClick={() => setActive(index)} */ />
  ));

  return (
    <Navbar
      width={{ sm: 80 }}
      hiddenBreakpoint="md"
      hidden={!openedNav}
      /* className={classes.navbar} */
      className={classes.navbar}
    >
      <Center>
        <UserButton
          logoutURL={`${plexoAPIEndpoint}/auth/logout`}
          user={userData}
          isLoadingUser={isLoadingUser}
          type="simple"
        />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" spacing={0}>
        <NavbarLink
          icon={IconSwitchHorizontal}
          label="Expand"
          onClick={() => setCollapseNavbar(false)}
        />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </Navbar>
  );
}
