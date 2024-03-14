import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Text,
  createStyles,
  Menu,
  Skeleton,
  Stack,
} from "@mantine/core";

import { Logout, Settings, UserCircle } from "tabler-icons-react";

import { User } from "lib/types";
import { useRouter } from "next/router";
import { ErrorNotification } from "lib/notifications";
import { usePlexoContext } from "context/PlexoContext";
import { UserPhoto } from "modules/profile";

const useStyles = createStyles(theme => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));

interface UserButtonProps extends UnstyledButtonProps {
  logoutURL: string;
  isLoadingUser: boolean;
  user: User | undefined;
}

export function UserButton({ logoutURL, user, isLoadingUser }: UserButtonProps) {
  const { classes } = useStyles();
  const plexo = usePlexoContext();

  const router = useRouter();

  const logout = async () => {
    try {
      const res = await fetch(logoutURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData);
        return ErrorNotification();
      }

      plexo.setAuthCookie("");
      return router.replace("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Group position="center">
      <Menu position={"bottom-end"} offset={0}>
        <Menu.Target>
          <UnstyledButton className={classes.user}>
            {isLoadingUser ? (
              <Group>
                <Skeleton height={38} circle />

                <Stack spacing={0} sx={{ flex: 1 }}>
                  <Skeleton height={10} mt={6} width="100%" radius="xs" />
                  <Skeleton height={8} mt={6} width="100%" radius="xs" />
                </Stack>
              </Group>
            ) : (
              <Group>
                <UserPhoto user={user} size="md" />
                <Stack spacing={0}>
                  <Text size="sm" weight={500}>
                    {user?.name}
                  </Text>

                  <Text color="dimmed" size="xs">
                    {user?.email}
                  </Text>
                </Stack>
              </Group>
            )}
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => {
              router.push("/profile");
            }}
            icon={<UserCircle strokeWidth={1.5} size={14} />}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              router.push({
                pathname: "/settings",
                query: { tab: "organization" },
              });
            }}
            icon={<Settings strokeWidth={1.5} size={14} />}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            color="red"
            onClick={handleLogout}
            component="button"
            icon={<Logout size={14} />}
          >
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
