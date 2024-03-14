import {
  Button,
  Menu,
  Text,
  TextInput,
  Skeleton,
  Checkbox,
  Group,
  Tooltip,
  ScrollArea,
  Center,
  Box,
  createStyles,
} from "@mantine/core";
import { Users } from "tabler-icons-react";

import { Member, ProjectById, TeamById } from "lib/types";
import { ChangeEvent, useEffect, useState } from "react";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { useActions } from "lib/hooks/useActions";
import { MemberPhoto } from "../MemberPhoto";
import { usePlexoContext } from "context/PlexoContext";

const useStyles = createStyles(theme => ({
  checkboxBody: {
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    paddingLeft: 5,
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

export const MembersIcon = () => {
  return <Users size={16} />;
};

export const MembersLabel = (members: number | undefined) => {
  return members && members >= 1 ? `${members} Members` : "Members";
};

export const MemberInfo = (member: Member | undefined) => {
  return (
    <Group spacing={5}>
      <Center w={26} h={26}>
        {MemberPhoto(member?.photoUrl)}
      </Center>
      {member?.name}
    </Group>
  );
};

type Payload = {
  id: string;
};

export const membersId = (members: Payload[] | undefined) => {
  return members?.map(a => a.id);
};

type GenericMembersMenuProps = {
  children: React.ReactNode;
  selectedMembers?: string[];
  setSelectedMembers?: (selectedMembers: string[]) => void;
};

const GenericMemberMenu = ({
  children,
  selectedMembers,
  setSelectedMembers,
}: GenericMembersMenuProps) => {
  const { membersData, isLoadingMembers } = usePlexoContext();

  const [searchValue, setSearchValue] = useState("");
  const [membersOptions, setMembersOptions] = useState<Member[]>([]);

  useEffect(() => {
    if (membersData) {
      searchValue == ""
        ? setMembersOptions(membersData)
        : setMembersOptions(
            membersData?.filter((item: Member) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          );
    }
  }, [membersData, searchValue]);

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Change members" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder="Change members"
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
        ></TextInput>
        <Menu.Divider />
        <ScrollArea.Autosize mah={250}>
          {isLoadingMembers ? (
            <Skeleton height={36} radius="sm" />
          ) : (
            <Checkbox.Group mt={10} value={selectedMembers} onChange={setSelectedMembers}>
              {membersOptions.map((m: Member) => {
                return (
                  <Menu.Item key={m.id}>
                    <Checkbox
                      size="xs"
                      value={m.id}
                      label={MemberInfo(m)}
                      styles={{
                        body: {
                          alignItems: "center",
                        },
                        label: {
                          paddingLeft: 5,
                        },
                      }}
                    />
                  </Menu.Item>
                );
              })}
            </Checkbox.Group>
          )}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

type MembersMenuProps = {
  children: React.ReactNode;
  project?: ProjectById;
  team?: TeamById;
};

const MembersMenu = ({ children, project, team }: MembersMenuProps) => {
  const { classes } = useStyles();
  const { fetchUpdateProject, fetchUpdateTeam } = useActions();
  const { membersData, isLoadingMembers } = usePlexoContext();
  const [searchValue, setSearchValue] = useState("");
  const [membersOptions, setMembersOptions] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    if (membersData) {
      searchValue == ""
        ? setMembersOptions(membersData)
        : setMembersOptions(
            membersData?.filter((item: Member) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          );
    }
  }, [membersData, searchValue]);

  useEffect(() => {
    if ((project && project.members) || (team && team.members)) {
      const teamMembers = team?.members.map(a => a.id as string);
      const projectMembers = project?.members.map(a => a.id as string);

      setSelectedMembers(project ? projectMembers! : teamMembers!);
    }
  }, [project, team]);

  const onUpdateProjectMembers = async (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.currentTarget;
    setSelectedMembers(
      checked ? [...selectedMembers, value] : selectedMembers.filter(a => a !== value)
    );

    const res = await fetchUpdateProject({
      id: project?.id,
      input: {
        members: {
          add: checked ? [value] : [],
          remove: checked ? [] : [value],
        },
      },
    });

    if (res.data) {
      SuccessNotification("Members updated", res.data.updateProject.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  const onUpdateTeamMembers = async (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.currentTarget;
    setSelectedMembers(
      checked ? [...selectedMembers, value] : selectedMembers.filter(a => a !== value)
    );
    const res = await fetchUpdateTeam({
      id: team?.id,
      input: {
        members: {
          add: checked ? [value] : [],
          remove: checked ? [] : [value],
        },
      },
    });

    if (res.data) {
      SuccessNotification("Members updated", res.data.updateTeam.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  /* useEffect(() => {
    if (members) {
      project && onUpdateProjectMembers(members);
      team && onUpdateTeamMembers(members);
    }
  }, [members]); */

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Project members" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder="Change members"
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
        ></TextInput>
        <Menu.Divider />
        <ScrollArea.Autosize mah={250}>
          {isLoadingMembers ? (
            <Skeleton height={36} radius="sm" />
          ) : (
            <Box mt={10}>
              {membersOptions.map((m: Member) => {
                return (
                  <Menu.Item key={m.id}>
                    <Checkbox
                      size="xs"
                      value={m.id}
                      label={MemberInfo(m)}
                      checked={selectedMembers.includes(m.id)}
                      onChange={event =>
                        project ? onUpdateProjectMembers(event) : onUpdateTeamMembers(event)
                      }
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
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

type MemberSelectorProps = {
  members: string[];
  setMembers: (members: string[]) => void;
};

export const MemberSelector = ({ members, setMembers }: MemberSelectorProps) => {
  return (
    <GenericMemberMenu selectedMembers={members} setSelectedMembers={setMembers}>
      <Button compact variant="light" color={"gray"} leftIcon={<MembersIcon />}>
        <Text size={"xs"}> {MembersLabel(members.length)}</Text>
      </Button>
    </GenericMemberMenu>
  );
};

type MemberSelectorByProjectProps = {
  project: ProjectById | undefined;
};

export const MemberSelectorByProject = ({ project }: MemberSelectorByProjectProps) => {
  return (
    <MembersMenu project={project}>
      <Button compact variant="light" color={"gray"} leftIcon={<MembersIcon />}>
        <Text size={"xs"}> {MembersLabel(project?.members.length)}</Text>
      </Button>
    </MembersMenu>
  );
};

type MemberSelectorByTeamProps = {
  team: TeamById | undefined;
};

export const MemberSelectorByTeam = ({ team }: MemberSelectorByTeamProps) => {
  return (
    <MembersMenu team={team}>
      <Button compact variant="light" color={"gray"} leftIcon={<MembersIcon />}>
        <Text size={"xs"}>{MembersLabel(team?.members.length)}</Text>
      </Button>
    </MembersMenu>
  );
};
