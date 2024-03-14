import { Group, Modal, useMantineTheme, Text, TextInput, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check, X } from "tabler-icons-react";

import { useActions } from "lib/hooks/useActions";
import { MemberSelector } from "../Project/members";
import { ProjectsSelector } from "./projects";
import { Team } from "lib/types";
import { usePlexoContext } from "context/PlexoContext";
import { TeamVisibility } from "integration/graphql";
import { VisibilitySelector } from "./visibility";

type NewTeamProps = {
  newTeamOpened: boolean;
  setNewTeamOpened: (newTeamOpened: boolean) => void;
};

const NewTeam = ({ newTeamOpened, setNewTeamOpened }: NewTeamProps) => {
  const theme = useMantineTheme();
  const { teamsData } = usePlexoContext();

  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<TeamVisibility>(TeamVisibility.None);
  const [prefix, setPrefix] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [teamExists, setTeamExists] = useState(false);

  const { createTeam, fetchCreateTeam } = useActions();

  const onCreateTeam = async () => {
    const res = await fetchCreateTeam({
      input: {
        name: name,
        visibility: visibility,
        prefix: name,
        members: members,
        projects: projects,
      },
    });

    if (res.data) {
      setNewTeamOpened(false);
      resetInitialValues();
      showNotification({
        autoClose: 5000,
        title: "Team created",
        message: res.data.createTeam.name,
        color: "blue",
        icon: <Check size={18} />,
      });
    }
    if (res.error) {
      showNotification({
        autoClose: 5000,
        title: "Error!",
        message: "Try again",
        color: "red",
        icon: <X size={18} />,
      });
    }
  };

  const resetInitialValues = () => {
    setName("");
    setVisibility(TeamVisibility.None);
    setPrefix("");
    setMembers([]);
    setProjects([]);
    setTeamExists(false);
  };

  const handleTeamName = (value: string) => {
    setName(value);
    const evalName =
      teamsData?.some((t: Team) => t.name.toLowerCase() == value.toLowerCase()) || false;
    setTeamExists(evalName);
  };

  return (
    <Modal
      closeOnEscape
      title={<Text size={"sm"}>New Team</Text>}
      opened={newTeamOpened}
      onClose={() => {
        setNewTeamOpened(false);
        resetInitialValues();
      }}
      size={"lg"}
      shadow="md"
      overlayProps={{
        color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.5,
        transitionProps: {
          transition: "slide-up",
        },
      }}
    >
      <TextInput
        mb={15}
        data-autoFocus
        size="md"
        placeholder="Team name"
        error={teamExists ? "Team already exists" : false}
        value={name}
        onChange={e => handleTeamName(e.target.value)}
        styles={{
          input: {
            backgroundColor: "transparent",
            borderColor: "transparent",
            "&:focus-within": {
              borderColor: theme.colors.brand[6],
            },
          },
        }}
      />
      <Group spacing={6} mb={"md"}>
        <MemberSelector members={members} setMembers={setMembers} />
        <ProjectsSelector projects={projects} setProjects={setProjects} />
        <VisibilitySelector visibility={visibility} setVisibility={setVisibility} type="button" />
      </Group>
      <Group
        pt={"md"}
        position="right"
        sx={{
          borderTopWidth: 1,
          borderTopStyle: "solid",
          borderTopColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2],
        }}
      >
        <Button compact variant="default" onClick={() => setNewTeamOpened(false)}>
          Cancel
        </Button>
        <Button
          compact
          disabled={!name.length || teamExists}
          variant="filled"
          loading={createTeam.fetching}
          onClick={() => {
            onCreateTeam();
          }}
        >
          Create Team
        </Button>
      </Group>
    </Modal>
  );
};

export default NewTeam;
