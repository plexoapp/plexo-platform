import {
  Group,
  Stack,
  TextInput,
  Text,
  useMantineTheme,
  Paper,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { Plus, X } from "tabler-icons-react";
import { useState } from "react";

import { TaskStatus } from "integration/graphql";
import { Member } from "lib/types";
import { ManualStatusSelector, StatusSelector, statusLabel } from "components/ui/Task/status";
import { LeadTaskSelector, ManualLeadTaskSelector } from "components/ui/Task/lead";
import { v4 as uuidv4 } from "uuid";
import { IconSparkles } from "@tabler/icons-react";

export type ProjectTask = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  lead: Member | null;
  origin: string;
};

type ProjectTasksProps = {
  tasks: ProjectTask[];
  setTasks: (subtasks: ProjectTask[]) => void;
  name: string;
  description: string;
};

const ProjectTasks = ({ tasks, setTasks, name, description }: ProjectTasksProps) => {
  const theme = useMantineTheme();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Backlog);
  const [lead, setLead] = useState<Member | null>(null);

  /*   const [
    { data: projectTasksSuggestionData, fetching: isLoadingProjectTasksSuggestion },
    fetchProjectTasksSuggestion,
  ] = useQuery({
    pause: true,
    query: SuggestProjectDocument,
    variables: {
      input: {
        title: name,
        description: description,
        generateTasksNumber: 3,
        initialTasks: tasks.map(task => {
          return {
            title: task.title,
            description: task.description,
            status: task.status,
           
          };
        }),
      },
    },
  }); */

  const handleAddSubtask = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setTasks([
      {
        id: uuidv4(),
        title: title,
        description: "",
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
            <ManualStatusSelector task={task} tasks={tasks} setTasks={setTasks} />
          </Tooltip>
          <Tooltip label={task.lead?.name ? task.lead?.name : "No assignee"} position="bottom">
            <ManualLeadTaskSelector task={task} tasks={tasks} setTasks={setTasks} />
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
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
      }}
    >
      <form onSubmit={handleAddSubtask}>
        <Text lineClamp={1} size={"sm"}>
          Add or generate tasks
        </Text>

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

          <Group spacing={4}>
            <Tooltip withinPortal label="Add task" position="bottom">
              <ActionIcon disabled={title.length ? false : true} color={"brand"} type="submit">
                <Plus size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip withinPortal label="Generate tasks with AI" position="bottom">
              <ActionIcon
                variant="light"
                color={"brand"}
                /* disabled={name.length ? false : true}
              onClick={() => addSuggestedTasks()} */
              >
                <IconSparkles size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </form>
      <Stack spacing={1}>{tasksList.length ? tasksList : null}</Stack>
    </Stack>
  );
};

export default ProjectTasks;
