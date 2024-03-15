import {
  ActionIcon,
  Group,
  Stack,
  TextInput,
  Text,
  Button,
  Paper,
  useMantineTheme,
  Center,
  Tooltip,
} from "@mantine/core";
import { Plus, X } from "tabler-icons-react";
import { useState } from "react";

import { LeadTaskSelector } from "./lead";
import { StatusIcon, StatusSelector, statusLabel } from "./status";
import { TaskStatus } from "integration/graphql";
import { Member } from "lib/types";
import { SubTask } from "./newTask";
import { MemberPhoto } from "../MemberPhoto";

type NewSubTasks = {
  subtasks: SubTask[];
  setSubtasks: (subtasks: SubTask[]) => void;
};

const NewSubTasks = ({ subtasks, setSubtasks }: NewSubTasks) => {
  const theme = useMantineTheme();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Backlog);
  const [lead, setLead] = useState<Member | null>(null);

  const handleAddSubtask = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setSubtasks([
      ...subtasks,
      {
        title: title,
        status: status,
        lead: lead,
      },
    ]);

    //Reset values
    setTitle("");
    setStatus(TaskStatus.Backlog);
    setLead(null);
  };

  const tasks = subtasks.map(task => {
    return (
      <Paper key={task.title} px={6} py={4} mt={1}>
        <Group spacing={0}>
          <Tooltip label={statusLabel(task.status)} position="bottom">
            <Center w={28} h={28}>
              {StatusIcon(theme, task.status)}
            </Center>
          </Tooltip>
          <Tooltip label={task.lead?.name ? task.lead?.name : "No assignee"} position="bottom">
            <Center w={28} h={28}>
              {MemberPhoto(task.lead)}
            </Center>
          </Tooltip>

          <Text size={"sm"} sx={{ flex: 1 }}>
            {task.title}
          </Text>
          <ActionIcon
            size={"sm"}
            onClick={() => setSubtasks(subtasks.filter(r => r.title !== task.title))}
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
      <Text p={"xs"} size={"xs"}>
        Sub-tasks
      </Text>
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
            <Text size={"xs"}>Add subtask</Text>
          </Button>
        </Group>
      </form>
      <Stack spacing={1}>{tasks.length ? tasks : null}</Stack>
    </Stack>
  );
};

export default NewSubTasks;
