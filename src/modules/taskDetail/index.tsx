import {
  ActionIcon,
  Group,
  Stack,
  Text,
  Divider,
  CopyButton,
  Tooltip,
  Box,
  Button,
  createStyles,
  MediaQuery,
  Card,
  Paper,
  useMantineTheme,
  Avatar,
  Center,
  Skeleton,
} from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { Copy, Dots, LayoutSidebar, ChevronLeft, Plus, X } from "tabler-icons-react";
import { useState, useEffect } from "react";
import { useQuery } from "urql";
import Link from "next/link";

import { LeadSelectorByTask } from "components/ui/Task/lead";
import { PriorityIcon, PrioritySelectorByTask, priorityName } from "components/ui/Task/priority";
import { ProjectSelectorByTask } from "components/ui/Task/project";
import {
  StatusIcon,
  StatusSelectorByTask,
  statusLabel,
  statusName,
} from "components/ui/Task/status";
import { LabelsSelectorBytask } from "components/ui/Task/labels";
import { AssigneesSelectorByTask } from "components/ui/Task/assignees";
import { TaskMenu } from "components/ui/Task/menu";
import { Task, TaskById, TaskSuggestion } from "lib/types";
import { useActions } from "lib/hooks/useActions";
import { usePlexoContext } from "context/PlexoContext";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { TaskListElement } from "components/ui/Task/task";
import { validateDate } from "lib/utils";
import { SubdivideTaskDocument } from "integration/graphql";
import { ActivitiesTask } from "./Activities";
import { TitleForm } from "./Form";
import { DateGenericSelector } from "components/ui/DateGenericSelector";

type TaskDetailProps = {
  task: TaskById | undefined;
  isLoading: boolean;
};

const useStyles = createStyles(theme => ({
  propsSection: {
    [theme.fn.smallerThan("lg")]: {
      display: "none",
    },
  },
  propsBar: {
    display: "none",
    [theme.fn.smallerThan("lg")]: {
      display: "flex",
    },
  },
  headerSections: {
    height: 22,
  },
}));

const parseSubtasks = (subtasks: TaskSuggestion[], parentTask: TaskById | undefined) => {
  return subtasks.map(task => {
    return {
      title: task.title,
      description: task.description,
      status: statusName(task.status),
      priority: priorityName(task.priority),
      dueDate: task.dueDate,
      parentId: parentTask?.id,
    };
  });
};

type SuggestionTasksProps = {
  tasksSuggestion: TaskSuggestion[];
  setTaskSuggestion: (tasksSuggestion: TaskSuggestion[]) => void;
  parentTask: TaskById | undefined;
};

const SuggestionTasks = ({
  tasksSuggestion,
  setTaskSuggestion,
  parentTask,
}: SuggestionTasksProps) => {
  const theme = useMantineTheme();
  const { createTasks, fetchCreateTasks } = useActions();

  const onClearSuggestions = () => {
    setTaskSuggestion([]);
  };

  const onDeleteTaskSuggestion = (task: TaskSuggestion) => {
    setTaskSuggestion(tasksSuggestion.filter(t => t.title !== task.title));
  };

  const onCreateTasks = async () => {
    const res = await fetchCreateTasks({
      input: {
        tasks: parseSubtasks(tasksSuggestion, parentTask),
      },
    });

    if (res.data) {
      SuccessNotification("Tasks created!", `${res.data.createTasks.length} tasks created`);
      onClearSuggestions();
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return tasksSuggestion.length ? (
    <Card
      sx={{
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[1],
      }}
    >
      <Stack>
        <Group spacing={"xs"}>
          <Avatar
            color="brand"
            variant="outline"
            size={"xs"}
            styles={{
              placeholder: {
                border: "none",
              },
            }}
          >
            <IconSparkles size={16} />
          </Avatar>

          <Text lineClamp={1} size={"sm"}>
            Suggestions
          </Text>
        </Group>
        <Stack spacing={3}>
          {tasksSuggestion.map(task => {
            return (
              <Paper key={task.title} px={6} py={4}>
                <Group spacing={8} sx={{ borderRadius: 4 }}>
                  <Tooltip label={priorityName(task.priority)} position="bottom">
                    <Center w={28} h={28}>
                      {PriorityIcon(task.priority)}
                    </Center>
                  </Tooltip>
                  <Tooltip label={statusLabel(task.status)} position="bottom">
                    <Center w={28} h={28}>
                      {StatusIcon(theme, task.status)}
                    </Center>
                  </Tooltip>

                  <Text size={"sm"} sx={{ flexGrow: 1 }}>
                    {task.title}
                  </Text>
                  <ActionIcon size={"sm"} onClick={() => onDeleteTaskSuggestion(task)}>
                    <X size={16} />
                  </ActionIcon>
                </Group>
              </Paper>
            );
          })}
        </Stack>
        <Group position="right">
          <Button compact variant="default" onClick={onClearSuggestions}>
            Cancel
          </Button>

          <Button compact variant="filled" loading={createTasks.fetching} onClick={onCreateTasks}>
            Add subtasks
          </Button>
        </Group>
      </Stack>
    </Card>
  ) : null;
};

const SubTasks = ({ task }: { task: TaskById | undefined }) => {
  const { setNewTaskOpened, setTaskId } = usePlexoContext();
  const [tasksSuggestion, setTaskSuggestion] = useState<TaskSuggestion[]>([]);

  const [{ data: subdivideTaskData, fetching: isLoadingSubdivide }, fetchTaskSubdivide] = useQuery({
    pause: true,
    query: SubdivideTaskDocument,
    variables: {
      input: {
        taskId: task?.id,
        subtasks: 2,
      },
    },
  });

  const applyAiTaskSubdivide = async () => {
    fetchTaskSubdivide();
  };

  useEffect(() => {
    if (subdivideTaskData) {
      setTaskSuggestion(subdivideTaskData.subdivideTask);
    }
  }, [subdivideTaskData]);

  return (
    <Stack mb={"xl"}>
      <Group position="apart">
        <Text lineClamp={1} size={"sm"} color={"dimmed"}>
          Subtasks
        </Text>
        <Group spacing={5}>
          <Tooltip label={"Add sub-task"} position="top">
            <ActionIcon
              onClick={() => {
                setTaskId(task?.id);
                setNewTaskOpened(true);
              }}
            >
              <Plus size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={"Auto divide"} position="top">
            <ActionIcon
              variant="light"
              color="brand"
              loading={isLoadingSubdivide}
              onClick={applyAiTaskSubdivide}
            >
              <IconSparkles size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Divider />
      {task?.subtasks.length ? (
        <Stack spacing={2}>
          {task?.subtasks
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((t: Task) => (
              <TaskListElement key={t.id} task={t} />
            ))}
        </Stack>
      ) : null}
      <SuggestionTasks
        tasksSuggestion={tasksSuggestion}
        setTaskSuggestion={setTaskSuggestion}
        parentTask={task}
      />
    </Stack>
  );
};

const TaskDetailPageContent = ({ task, isLoading }: TaskDetailProps) => {
  const { classes, theme } = useStyles();
  const { setNavBarOpened } = usePlexoContext();
  const { fetchUpdateTask } = useActions();
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const onUpdateTaskDueDate = async (dueDate: Date | null) => {
    const res = await fetchUpdateTask({
      id: task?.id,
      input: {
        dueDate: dueDate === null ? new Date(0) : dueDate,
      },
    });

    if (res.data) {
      SuccessNotification("Due date updated", res.data.updateTask.title);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  useEffect(() => {
    if (task) {
      setDueDate(validateDate(task.dueDate));
    }
  }, [task]);

  const handleDateChange = (date: Date | null) => {
    setDueDate(date);
    onUpdateTaskDueDate(date);
  };

  return (
    <Stack h={"100vh"}>
      <Group
        h={73}
        px={20}
        sx={{
          borderBottom: `1px solid ${
            theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
          }`,
        }}
      >
        <MediaQuery largerThan="md" styles={{ display: "none" }}>
          <ActionIcon onClick={() => setNavBarOpened(true)}>
            <LayoutSidebar size={16} />
          </ActionIcon>
        </MediaQuery>
        <Link href="/tasks" passHref>
          <ActionIcon variant="subtle">
            <ChevronLeft size={20} />
          </ActionIcon>
        </Link>
      </Group>
      <Group px={20} sx={{ alignItems: "baseline" }}>
        <Stack maw={860} m="auto" h={"100%"} sx={{ flex: 1 }}>
          <Stack spacing={10}>
            <Group position="apart" className={classes.headerSections}>
              {isLoading ? (
                <Skeleton width={50} height={8} />
              ) : (
                <Text lineClamp={1} size={"sm"} color={"dimmed"}>
                  {`PLE-${task?.count}`}
                </Text>
              )}

              <TaskMenu task={task}>
                <ActionIcon radius={"sm"} size={"xs"} disabled={task?.id ? false : true}>
                  <Dots size={18} />
                </ActionIcon>
              </TaskMenu>
            </Group>
            {isLoading ? (
              <Box className={classes.propsBar}>
                <Skeleton height={20} />
              </Box>
            ) : (
              <Group spacing={5} className={classes.propsBar}>
                <StatusSelectorByTask task={task} type="button" />
                <PrioritySelectorByTask task={task} type="button" />
                <LeadSelectorByTask task={task} type="button" />
                <AssigneesSelectorByTask task={task} />
                <LabelsSelectorBytask task={task} />
                <ProjectSelectorByTask task={task} />
                <DateGenericSelector
                  placeholder={"Set due date"}
                  date={dueDate}
                  onChange={handleDateChange}
                />
              </Group>
            )}
          </Stack>

          <Divider />
          <TitleForm task={task} isLoading={isLoading} />
          <SubTasks task={task} />
          <ActivitiesTask task={task} isLoading={isLoading} />
        </Stack>

        <Divider orientation="vertical" className={classes.propsSection} />
        <Stack miw={320} maw={400} className={classes.propsSection}>
          <Group className={classes.headerSections}>
            <CopyButton value={task?.id} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy task ID"} position="top">
                  <ActionIcon
                    size={"xs"}
                    radius={"sm"}
                    onClick={copy}
                    disabled={task?.id ? false : true}
                  >
                    <Copy size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          <Divider />
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Status
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <StatusSelectorByTask task={task} type={"button"} />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Priority
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <PrioritySelectorByTask task={task} type="button" />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Lead
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <LeadSelectorByTask task={task} type="button" />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Assignee
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <AssigneesSelectorByTask task={task} />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Labels
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <LabelsSelectorBytask task={task} />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Project
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <ProjectSelectorByTask task={task} />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Due Date
            </Text>

            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <DateGenericSelector
                placeholder={"Set due date"}
                date={dueDate}
                onChange={handleDateChange}
              />
            )}
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default TaskDetailPageContent;
