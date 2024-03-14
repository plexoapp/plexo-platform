import {
  Group,
  Modal,
  Text,
  TextInput,
  Textarea,
  Button,
  Popover,
  Tooltip,
  Stack,
  createStyles,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { CalendarTime, Check, X } from "tabler-icons-react";
import { useState } from "react";

import { useActions } from "lib/hooks/useActions";
import { DateLabel } from "lib/utils";
import { Member } from "lib/types";
import { TeamSelector } from "./team";
import { LeadProjectSelector } from "./lead";
import { MemberSelector } from "./members";
import { StatusProjectSelector } from "./status";
import { ProjectStatus } from "integration/graphql";

type NewProjectProps = {
  newProjectOpened: boolean;
  setNewProjectOpened: (newProjectOpened: boolean) => void;
};

const useStyles = createStyles(theme => ({
  input: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    "&:focus-within": {
      borderColor: theme.colors.brand[6],
    },
  },
}));

const NewProject = ({ newProjectOpened, setNewProjectOpened }: NewProjectProps) => {
  const { classes, theme } = useStyles();

  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.None);
  const [lead, setLead] = useState<Member | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);

  const { createProject, fetchCreateProject } = useActions();

  const onCreateProject = async () => {
    const res = await fetchCreateProject({
      input: {
        name: name,
        prefix: prefix,
        description: description.length ? description : null,
        status: status,
        leadId: lead?.id,
        startDate: startDate,
        dueDate: dueDate,
        members: members,
        teams: teams,
      },
    });

    if (res.data) {
      setNewProjectOpened(false);
      resetInitialValues();
      showNotification({
        autoClose: 5000,
        title: "Project created",
        message: res.data.createProject.name,
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
    setPrefix("");
    setDescription("");
    setStatus(ProjectStatus.None);
    setLead(null);
    setDueDate(null);
    setStartDate(null);
    setMembers([]);
    setTeams([]);
  };

  return (
    <Modal
      overlayProps={{
        color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.5,
        transitionProps: {
          transition: "slide-up",
        },
      }}
      size={"lg"}
      opened={newProjectOpened}
      onClose={() => {
        setNewProjectOpened(false);
        resetInitialValues();
      }}
      shadow="md"
      title={
        <Group spacing={8}>
          <Text size={"sm"}>New Project</Text>
        </Group>
      }
    >
      <Stack spacing={10}>
        <TextInput
          data-autoFocus
          placeholder="Project name"
          value={name}
          onChange={e => setName(e.target.value)}
          size="md"
          classNames={{
            input: classes.input,
          }}
        />
        <Textarea
          autosize
          minRows={2}
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          size="sm"
          classNames={{
            input: classes.input,
          }}
        />
        <Group spacing={6} mb={"md"}>
          <StatusProjectSelector status={status} setStatus={setStatus} type="button" />
          <LeadProjectSelector lead={lead} setLead={setLead} />
          <MemberSelector members={members} setMembers={setMembers} />
          <TeamSelector teams={teams} setTeams={setTeams} />
          <Popover position="bottom" shadow="md" withinPortal>
            <Popover.Target>
              <Tooltip label="Change start date" position="bottom">
                <Button
                  compact
                  variant="light"
                  color={"gray"}
                  leftIcon={<CalendarTime size={16} />}
                >
                  <Text size={"xs"}>{DateLabel(startDate, "Start date")}</Text>
                </Button>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>
              <DatePicker value={startDate} onChange={setStartDate} />
            </Popover.Dropdown>
          </Popover>

          <Popover position="bottom" shadow="md" withinPortal>
            <Popover.Target>
              <Tooltip label="Change due date" position="bottom">
                <Button
                  compact
                  variant="light"
                  color={"gray"}
                  leftIcon={<CalendarTime size={16} />}
                >
                  <Text size={"xs"}>{DateLabel(dueDate, "Due date")}</Text>
                </Button>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>
              <DatePicker value={dueDate} onChange={setDueDate} />
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Stack>

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
        <Button compact variant="default" onClick={() => setNewProjectOpened(false)}>
          Cancel
        </Button>
        <Button
          compact
          variant="filled"
          disabled={name.length ? false : true}
          loading={createProject.fetching}
          onClick={() => {
            onCreateProject();
          }}
        >
          Create project
        </Button>
      </Group>
    </Modal>
  );
};

export default NewProject;
