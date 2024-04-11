import { Menu, Navbar, NavLink, Skeleton, Stack, useMantineTheme } from "@mantine/core";
import { Dna } from "tabler-icons-react";
import router from "next/router";

import { Team } from "lib/types";
import { usePlexoContext } from "context/PlexoContext";

export const TeamsList = () => {
  const theme = useMantineTheme();
  const { teamsData, isLoadingTeams } = usePlexoContext();

  const teams = teamsData
    ?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((t: Team, index: number) => {
      return (
        <NavLink
          key={index}
          label={t.name}
          icon={<Dna size={16} color={theme.colors.brand[6]} />}
          onClick={() => router.push(`/teams/${t.id}`)}
          styles={theme => ({
            root: {
              borderRadius: theme.radius.sm,
            },
          })}
        ></NavLink>
      );
    });

  return (
    <Navbar.Section>
      {isLoadingTeams ? (
        <Stack spacing={5}>
          <Skeleton height={38} />
          <Skeleton height={38} />
        </Stack>
      ) : (
        teams
      )}
    </Navbar.Section>
  );
};

export const TeamsMenuList = () => {
  const theme = useMantineTheme();
  const { teamsData, isLoadingTeams } = usePlexoContext();

  const teams = teamsData
    ?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((t: Team, index: number) => {
      return (
        <Menu.Item
          key={index}
          icon={<Dna size={16} color={theme.colors.brand[6]} />}
          onClick={() => router.push(`/teams/${t.id}`)}
          styles={theme => ({
            root: {
              borderRadius: theme.radius.sm,
            },
          })}
        >
          {t.name}
        </Menu.Item>
      );
    });

  return teams;
};
