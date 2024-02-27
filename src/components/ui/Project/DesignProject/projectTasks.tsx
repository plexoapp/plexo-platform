import {
  Group,
  Stack,
  TextInput,
  Text,
  Button,
  useMantineTheme,
  Paper,
  Tooltip,
  Center,
  ActionIcon,
} from "@mantine/core";
import { Plus, X } from "tabler-icons-react";
import { useState } from "react";

import { TaskStatus } from "integration/graphql";
import { Member } from "lib/types";
import { StatusIcon, StatusSelector, statusLabel } from "components/ui/Task/status";
import { LeadTaskSelector } from "components/ui/Task/lead";
import { MemberPhoto } from "components/ui/MemberPhoto";
import { v4 as uuidv4 } from "uuid";
import { IconSparkles } from "@tabler/icons-react";

export type ProjectTask = {
  id: string;
  title: string;
  status: TaskStatus;
  lead: Member | null;
  origin: string;
};

type ProjectTasksProps = {
  tasks: ProjectTask[];
  setTasks: (subtasks: ProjectTask[]) => void;
};

const ProjectTasks = ({ tasks, setTasks }: ProjectTasksProps) => {
  const theme = useMantineTheme();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Backlog);
  const [lead, setLead] = useState<Member | null>(null);

  const handleAddSubtask = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setTasks([
      {
        id: uuidv4(),
        title: title,
        status: status,
        lead: lead,
        origin: "created",
      },
      ...tasks,
    ]);

    // Reset task values
    setTitle("");
    setStatus(TaskStatus.Backlog);
    setLead(null);
  };

  const tasksList = tasks.map(task => {
    return (
      <Paper key={task.id} px={6} py={4} mt={1}>
        <Group spacing={0}>
          <Tooltip label={statusLabel(task.status)} position="bottom">
            <Center w={28} h={28}>
              {StatusIcon(theme, task.status)}
            </Center>
          </Tooltip>
          <Tooltip label={task.lead?.name ? task.lead?.name : "No assignee"} position="bottom">
            <Center w={28} h={28}>
              {MemberPhoto(task.lead?.photoUrl)}
            </Center>
          </Tooltip>

          <Text size={"sm"} sx={{ flex: 1 }}>
            {task.title}
          </Text>
          {task.origin === "suggested" ? (
            <Tooltip label={"Suggested task"} position="bottom">
              <IconSparkles size={16} color={theme.colors.brand[6]} />
            </Tooltip>
          ) : null}

          <ActionIcon
            ml={4}
            size={"sm"}
            onClick={() => setTasks(tasks.filter(r => r.id !== task.id))}
          >
            <X size={16} />
          </ActionIcon>
        </Group>
      </Paper>
    );
  });

  return (
    <Stack
      spacing={0}
      p={10}
      sx={{
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2],
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
      }}
    >
      <form onSubmit={handleAddSubtask}>
        <Group spacing={0} px={6} py={4}>
          <StatusSelector status={status} setStatus={setStatus} type="icon" />
          <LeadTaskSelector lead={lead} setLead={setLead} type="icon" />

          <TextInput
            autoFocus
            placeholder="Task Title"
            variant="unstyled"
            value={title}
            onChange={e => setTitle(e.target.value)}
            styles={{
              root: {
                flexGrow: 1,
              },
            }}
          />

          <Button
            compact
            disabled={title.length ? false : true}
            variant="light"
            color={"brand"}
            leftIcon={<Plus size={16} />}
            type="submit"
          >
            <Text size={"xs"}>Add task</Text>
          </Button>
        </Group>
      </form>
      <Stack spacing={1}>{tasksList.length ? tasksList : null}</Stack>
    </Stack>
  );
};

export default ProjectTasks;
