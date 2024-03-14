import { Navbar, NavLink, Skeleton, Stack, useMantineTheme } from "@mantine/core";
import { Rocket } from "tabler-icons-react";
import router from "next/router";

import { Project } from "lib/types";
import { usePlexoContext } from "context/PlexoContext";

const ProjectsList = () => {
  const theme = useMantineTheme();
  const { projectsData, isLoadingProjects } = usePlexoContext();

  const projects = projectsData
    ?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((p: Project, index: number) => {
      return (
        <NavLink
          key={index}
          label={p.name}
          icon={<Rocket size={16} color={theme.colors.brand[6]} />}
          onClick={() => router.push(`/projects/${p.id}`)}
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
      {isLoadingProjects ? (
        <Stack spacing={5}>
          <Skeleton height={38} />
          <Skeleton height={38} />
        </Stack>
      ) : (
        projects
      )}
    </Navbar.Section>
  );
};

export default ProjectsList;
