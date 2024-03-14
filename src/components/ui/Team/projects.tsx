import {
  Button,
  Menu,
  Text,
  TextInput,
  Skeleton,
  Checkbox,
  Tooltip,
  Box,
  createStyles,
} from "@mantine/core";
import { useState, useEffect, ChangeEvent } from "react";

import { Project, TeamById } from "lib/types";
import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { ProjectIcon } from "../Task/project";
import { usePlexoContext } from "context/PlexoContext";

const useStyles = createStyles(theme => ({
  checkboxBody: {
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    paddingLeft: 10,
  },
  checkboxInner: {
    width: 20,
    height: 20,
  },
  checkboxInput: {
    width: "100%",
    height: "100%",
  },
}));

type Payload = {
  id: string;
};

export const ProjectLabel = (projects: number | undefined) => {
  return projects && projects >= 1 ? `${projects} Projects` : "Projects";
};

export const ProjectName = (name: string | undefined) => {
  return name ? name : "Project";
};

export const projectsId = (projects: Payload[] | undefined) => {
  return projects?.map(a => a.id);
};

type GenericProjectsMenuProps = {
  children: React.ReactNode;
  selectedProjects?: string[];
  setSelectedProjects?: (projects: string[]) => void;
};

const GenericProjectsMenu = ({
  children,
  selectedProjects,
  setSelectedProjects,
}: GenericProjectsMenuProps) => {
  const { projectsData, isLoadingProjects } = usePlexoContext();

  const [searchValue, setSearchValue] = useState("");
  const [projectOptions, setProjectOptions] = useState<Project[]>([]);

  useEffect(() => {
    if (projectsData) {
      searchValue == ""
        ? setProjectOptions(projectsData)
        : setProjectOptions(
            projectsData?.filter((item: Project) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          );
    }
  }, [projectsData, searchValue]);

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Change projects" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder="Change project members"
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
        ></TextInput>
        <Menu.Divider />
        {isLoadingProjects ? (
          <Skeleton height={36} radius="sm" />
        ) : (
          <Checkbox.Group mt={10} value={selectedProjects} onChange={setSelectedProjects}>
            {projectOptions.map((p: Project) => {
              return (
                <Menu.Item key={p.id}>
                  <Checkbox
                    size="xs"
                    value={p.id}
                    label={ProjectName(p.name)}
                    styles={{
                      body: {
                        alignItems: "center",
                      },
                      label: {
                        paddingLeft: 10,
                      },
                    }}
                  />
                </Menu.Item>
              );
            })}
          </Checkbox.Group>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

type ProjectsByTeamMenuProps = {
  children: React.ReactNode;

  team?: TeamById;
};

const ProjectsByTeamMenu = ({ children, team }: ProjectsByTeamMenuProps) => {
  const { classes } = useStyles();
  const { fetchUpdateTeam } = useActions();
  const { projectsData, isLoadingProjects } = usePlexoContext();

  const [projects, setProjects] = useState<string[] | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [projectOptions, setProjectOptions] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => {
    if (projectsData) {
      searchValue == ""
        ? setProjectOptions(projectsData)
        : setProjectOptions(
            projectsData?.filter((item: Project) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          );
    }
  }, [projectsData, searchValue]);

  useEffect(() => {
    if (team && team.projects) {
      const projectsIds = team.projects.map(a => a.id as string);

      setSelectedProjects(projectsIds);
    }
  }, [team]);

  const onUpdateTeamProjects = async (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.currentTarget;
    setSelectedProjects(
      checked ? [...selectedProjects, value] : selectedProjects.filter(a => a !== value)
    );
    const res = await fetchUpdateTeam({
      id: team?.id,
      input: {
        teams: {
          // cambiar teams a projects cuando se actualice en core
          add: checked ? [value] : [],
          remove: checked ? [] : [value],
        },
      },
    });

    if (res.data) {
      SuccessNotification("Projects updated", res.data.updateTeam.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Project members" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder="Change project members"
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
        ></TextInput>
        <Menu.Divider />
        {isLoadingProjects ? (
          <Skeleton height={36} radius="sm" />
        ) : (
          <Box mt={10}>
            {projectOptions.map((p: Project) => {
              return (
                <Menu.Item key={p.id}>
                  <Checkbox
                    size="xs"
                    value={p.id}
                    label={ProjectName(p.name)}
                    checked={selectedProjects.includes(p.id)}
                    onChange={event => onUpdateTeamProjects(event)}
                    classNames={{
                      body: classes.checkboxBody,
                      label: classes.checkboxLabel,
                      inner: classes.checkboxInner,
                      input: classes.checkboxInput,
                    }}
                  />
                </Menu.Item>
              );
            })}
          </Box>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

type ProjectsSelectorProps = {
  projects: string[];
  setProjects: (projects: string[]) => void;
};

export const ProjectsSelector = ({ projects, setProjects }: ProjectsSelectorProps) => {
  return (
    <GenericProjectsMenu selectedProjects={projects} setSelectedProjects={setProjects}>
      <Button compact variant="light" color={"gray"} leftIcon={<ProjectIcon />}>
        <Text size={"xs"}>{ProjectLabel(projects.length)}</Text>
      </Button>
    </GenericProjectsMenu>
  );
};

type ProjectsSelectorByTeamProps = {
  team: TeamById | undefined;
};

export const ProjectsSelectorByTeam = ({ team }: ProjectsSelectorByTeamProps) => {
  return (
    <ProjectsByTeamMenu team={team}>
      <Button compact variant="light" color={"gray"} leftIcon={<ProjectIcon />}>
        <Text size={"xs"}>{ProjectLabel(team?.projects.length)}</Text>
      </Button>
    </ProjectsByTeamMenu>
  );
};
