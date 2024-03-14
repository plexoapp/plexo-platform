import {
  Button,
  Kbd,
  Menu,
  Text,
  TextInput,
  Skeleton,
  Tooltip,
  Checkbox,
  createStyles,
  Group,
  ScrollArea,
  Divider,
  Box,
} from "@mantine/core";
import { Affiliate } from "tabler-icons-react";
import { ChangeEvent, useEffect, useState } from "react";

import { ProjectById, Team } from "lib/types";
import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { usePlexoContext } from "context/PlexoContext";

const useStyles = createStyles(theme => ({
  checkbox: {
    width: "100%",
  },
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

export const TeamLabel = (teams: number | undefined) => {
  return teams && teams >= 1 ? `${teams} Teams` : "Teams";
};

export const TeamIcon = () => {
  return <Affiliate size={16} />;
};

export const TeamName = (team: Team | undefined) => {
  //change to team prefix
  return team ? team.name : "NT"; //(No Team)
};

type TeamCheckboxProps = {
  teamFilters: string[];
  setTeamFilters: (teamFilters: string[]) => void;
};

export const TeamCheckboxGroup = ({ teamFilters, setTeamFilters }: TeamCheckboxProps) => {
  const { classes } = useStyles();
  const { teamsData } = usePlexoContext();
  const [searchValue, setSearchValue] = useState("");
  const [teamOptions, setTeamOptions] = useState<Team[]>([]);

  useEffect(() => {
    if (teamsData) {
      setTeamOptions(
        teamsData?.filter((item: Team) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue]);

  return (
    <>
      <TextInput
        placeholder="Team"
        variant="unstyled"
        value={searchValue}
        onChange={event => setSearchValue(event.currentTarget.value)}
      />
      <Divider />
      <ScrollArea.Autosize mah={250}>
        <Checkbox.Group mt={10} value={teamFilters} onChange={setTeamFilters}>
          {teamOptions.map(t => {
            return (
              <Checkbox
                key={t.id}
                size="xs"
                pb={15}
                value={t.id}
                label={
                  <Group spacing={5}>
                    {TeamIcon()}
                    {TeamName(t)}
                  </Group>
                }
                classNames={{
                  body: classes.checkbox,
                  labelWrapper: classes.checkbox,
                }}
              />
            );
          })}
        </Checkbox.Group>
      </ScrollArea.Autosize>
    </>
  );
};

export const teamsId = (project: ProjectById | undefined) => {
  return project?.teams.map(t => t.id);
};

type GenericTeamsMenuProps = {
  children: React.ReactNode;
  selectedTeams?: string[];
  setSelectedTeams?: (teams: string[]) => void;
};

const GenericTeamMenu = ({ children, selectedTeams, setSelectedTeams }: GenericTeamsMenuProps) => {
  const { teamsData, isLoadingTeams } = usePlexoContext();
  const [searchValue, setSearchValue] = useState("");
  const [teamsOptions, setTeamsOptions] = useState<Team[]>([]);

  useEffect(() => {
    if (teamsData) {
      searchValue == ""
        ? setTeamsOptions(teamsData)
        : setTeamsOptions(
            teamsData?.filter((item: Team) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          );
    }
  }, [teamsData, searchValue]);

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Change teams" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder="Set team..."
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
          rightSection={<Kbd px={8}>T</Kbd>}
        ></TextInput>
        <Menu.Divider />
        {isLoadingTeams ? (
          <Skeleton height={36} radius="sm" />
        ) : (
          <Checkbox.Group mt={10} value={selectedTeams} onChange={setSelectedTeams}>
            {teamsOptions.map((t: Team) => {
              return (
                <Menu.Item key={t.id}>
                  <Checkbox
                    size="xs"
                    value={t.id}
                    label={TeamName(t)}
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

type TeamsByProjectMenuProps = {
  children: React.ReactNode;
  project?: ProjectById;
};

const TeamByProjectMenu = ({ children, project }: TeamsByProjectMenuProps) => {
  const { classes } = useStyles();
  const { teamsData, isLoadingTeams } = usePlexoContext();
  const { fetchUpdateProject } = useActions();

  const [searchValue, setSearchValue] = useState("");
  const [teamsOptions, setTeamsOptions] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  useEffect(() => {
    if (teamsData) {
      searchValue == ""
        ? setTeamsOptions(teamsData)
        : setTeamsOptions(
            teamsData?.filter((item: Team) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          );
    }
  }, [teamsData, searchValue]);

  useEffect(() => {
    if (project && project.teams) {
      const teamsIds = project.teams.map(a => a.id as string);

      setSelectedTeams(teamsIds);
    }
  }, [project]);

  const onUpdateProjectTeams = async (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.currentTarget;
    setSelectedTeams(checked ? [...selectedTeams, value] : selectedTeams.filter(a => a !== value));
    const res = await fetchUpdateProject({
      id: project?.id,
      input: {
        teams: {
          add: checked ? [value] : [],
          remove: checked ? [] : [value],
        },
      },
    });

    if (res.data) {
      SuccessNotification("Teams updated", res.data.updateProject.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Teams" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder="Set team..."
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
          rightSection={<Kbd px={8}>T</Kbd>}
        ></TextInput>
        <Menu.Divider />
        {isLoadingTeams ? (
          <Skeleton height={36} radius="sm" />
        ) : (
          <Box mt={10}>
            {teamsOptions.map((t: Team) => {
              return (
                <Menu.Item key={t.id}>
                  <Checkbox
                    size="xs"
                    value={t.id}
                    label={TeamName(t)}
                    checked={selectedTeams.includes(t.id)}
                    onChange={event => onUpdateProjectTeams(event)}
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

type TeamSelectorProps = {
  teams: string[];
  setTeams: (teams: string[]) => void;
};

export const TeamSelector = ({ teams, setTeams }: TeamSelectorProps) => {
  return (
    <GenericTeamMenu selectedTeams={teams} setSelectedTeams={setTeams}>
      <Button compact variant="light" color={"gray"} leftIcon={<TeamIcon />}>
        <Text size={"xs"}>{TeamLabel(teams.length)}</Text>
      </Button>
    </GenericTeamMenu>
  );
};

type TeamSelectorByProjectProps = {
  project: ProjectById | undefined;
};

export const TeamSelectorByProject = ({ project }: TeamSelectorByProjectProps) => {
  return (
    <TeamByProjectMenu project={project}>
      <Button compact variant="light" color={"gray"} leftIcon={<TeamIcon />}>
        <Text size={"xs"}>{TeamLabel(project?.teams.length)}</Text>
      </Button>
    </TeamByProjectMenu>
  );
};
