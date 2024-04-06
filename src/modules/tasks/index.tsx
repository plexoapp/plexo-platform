import {
  Group,
  Text,
  Title,
  Container,
  SegmentedControl,
  Center,
  Skeleton,
  SimpleGrid,
  ScrollArea,
  Stack,
  createStyles,
  MediaQuery,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { LayoutColumns, LayoutRows, LayoutSidebar } from "tabler-icons-react";
import { getCookie, setCookie } from "cookies-next";
import { useQuery } from "urql";

import { TasksDocument, TaskStatus } from "integration/graphql";
import { TaskCardElement, TaskListElement } from "components/ui/Task/task";
import { StatusIcon, statusName } from "components/ui/Task/status";
import { usePlexoContext } from "context/PlexoContext";
import { Task } from "lib/types";
import FilterMenu from "components/ui/Filters/filterMenu";

const useStyles = createStyles(theme => ({
  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
    [theme.fn.smallerThan("xs")]: {
      marginRight: -10,
    },
  },
  "text-view-buttons": {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  "text-header-buttons": {
    [theme.fn.smallerThan("sm")]: {
      fontSize: "90%",
    },
    [theme.fn.smallerThan("xs")]: {
      fontSize: "70%",
      marginRight: -15,
      marginLeft: -5,
    },
  },
  "icon-header-buttons": {
    [theme.fn.smallerThan("sm")]: {
      width: "90%",
      height: "90%",
    },
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  "segmented-control": {
    [theme.fn.smallerThan("xs")]: {
      marginLeft: -5,
    },
  },
}));

const DndTaskBoard = ({ statusData }: { statusData: Task[] }) => {
  const [state, handlers] = useListState([...statusData]);

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        handlers.reorder({ from: source.index, to: destination?.index || 0 });
      }}
    >
      <Droppable droppableId="task-list" direction="vertical">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {state.map((t: Task, index: number) => (
              <Draggable key={t.id} draggableId={t.id} index={index}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCardElement key={t.id} task={{ ...t, status: t.status }} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const DndTaskList = ({ statusData }: { statusData: Task[] }) => {
  const [state, handlers] = useListState([...statusData]);

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        handlers.reorder({ from: source.index, to: destination?.index || 0 });
      }}
    >
      <Droppable droppableId="task-list" direction="vertical">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {state.map((t: Task, index: number) => (
              <Draggable key={t.id} draggableId={t.id} index={index}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskListElement key={t.id} task={{ ...t, status: t.status }} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

type StatusCounterProps = {
  status: TaskStatus;
  taskData: Task[] | undefined;
};

type TaskProps = {
  status: TaskStatus;
};

type TasksProps = {
  taskData: Task[] | undefined;
  fetching: boolean;
};

type CounterProps = {
  status: TaskStatus;
  fetching: boolean;
};

const StatusCounter = ({ status, taskData }: StatusCounterProps) => {
  const theme = useMantineTheme();
  return (
    <Group spacing={6} my={10}>
      {StatusIcon(theme, status)}
      <Title order={6}>{statusName(status)}</Title>
      <Text color="dimmed" size="xs">
        {taskData?.filter(task => task.status == status).length}
      </Text>
    </Group>
  );
};

const TasksBoard = ({ taskData, fetching }: TasksProps) => {
  const dataByStatus = (status: TaskStatus) => {
    const data = taskData
      ? taskData
          ?.filter((t: { status: string }) => t.status == status)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      : [];

    return data;
  };

  const TaskCard = ({ status }: TaskProps) => {
    return <DndTaskBoard statusData={dataByStatus(status)} />;
  };

  const Counter = ({ status, fetching }: CounterProps) => {
    return dataByStatus(status).length || fetching ? (
      <StatusCounter taskData={taskData} status={status} />
    ) : (
      <></>
    );
  };

  //return true if there is at least one task in the status
  const StatusBoardEnable = (status: TaskStatus) => {
    const data = taskData ? taskData?.filter((t: { status: string }) => t.status == status) : [];
    return data.length > 0;
  };

  const StatusBoardCols = () => {
    let colsCounter = 4;
    StatusBoardEnable(TaskStatus.None) ? (colsCounter += 1) : (colsCounter += 0);
    StatusBoardEnable(TaskStatus.Backlog) ? (colsCounter += 1) : (colsCounter += 0);
    StatusBoardEnable(TaskStatus.ToDo) ? (colsCounter += 1) : (colsCounter += 0);
    StatusBoardEnable(TaskStatus.InProgress) ? (colsCounter += 1) : (colsCounter += 0);
    StatusBoardEnable(TaskStatus.Done) ? (colsCounter += 1) : (colsCounter += 0);
    StatusBoardEnable(TaskStatus.Canceled) ? (colsCounter += 1) : (colsCounter += 0);
    return colsCounter > 6 ? 6 : colsCounter;
  };

  return (
    <ScrollArea type="hover" offsetScrollbars style={{ height: "calc(100vh - 90px)" }}>
      <SimpleGrid cols={StatusBoardCols()} spacing={325}>
        {StatusBoardEnable(TaskStatus.None) && (
          <Stack spacing={0} sx={{ minWidth: 312, marginLeft: 20 }}>
            <Counter status={TaskStatus.None} fetching={fetching} />
            <ScrollArea style={{ height: 812 }} offsetScrollbars>
              {fetching ? (
                <Skeleton height={36} radius="sm" />
              ) : (
                <TaskCard status={TaskStatus.None} />
              )}
            </ScrollArea>
          </Stack>
        )}
        {StatusBoardEnable(TaskStatus.Backlog) && (
          <Stack spacing={0} sx={{ minWidth: 312, marginLeft: 20 }}>
            <Counter status={TaskStatus.Backlog} fetching={fetching} />
            <ScrollArea style={{ height: 812 }} offsetScrollbars>
              {fetching ? (
                <Skeleton height={36} radius="sm" />
              ) : (
                <TaskCard status={TaskStatus.Backlog} />
              )}
            </ScrollArea>
          </Stack>
        )}
        {StatusBoardEnable(TaskStatus.ToDo) && (
          <Stack spacing={0} sx={{ minWidth: 312, marginLeft: 20 }}>
            <Counter status={TaskStatus.ToDo} fetching={fetching} />
            <ScrollArea style={{ height: 812 }} offsetScrollbars>
              {fetching ? (
                <Skeleton height={36} radius="sm" />
              ) : (
                <TaskCard status={TaskStatus.ToDo} />
              )}
            </ScrollArea>
          </Stack>
        )}
        {StatusBoardEnable(TaskStatus.InProgress) && (
          <Stack spacing={0} sx={{ minWidth: 312, marginLeft: 20 }}>
            <Counter status={TaskStatus.InProgress} fetching={fetching} />
            <ScrollArea style={{ height: 812 }} offsetScrollbars>
              {fetching ? (
                <Skeleton height={36} radius="sm" />
              ) : (
                <TaskCard status={TaskStatus.InProgress} />
              )}
            </ScrollArea>
          </Stack>
        )}
        {StatusBoardEnable(TaskStatus.Done) && (
          <Stack spacing={0} sx={{ minWidth: 312, marginLeft: 20 }}>
            <Counter status={TaskStatus.Done} fetching={fetching} />
            <ScrollArea style={{ height: 812 }} offsetScrollbars>
              {fetching ? (
                <Skeleton height={36} radius="sm" />
              ) : (
                <TaskCard status={TaskStatus.Done} />
              )}
            </ScrollArea>
          </Stack>
        )}
        {StatusBoardEnable(TaskStatus.Canceled) && (
          <Stack spacing={0} sx={{ minWidth: 312, marginLeft: 20 }}>
            <Counter status={TaskStatus.Canceled} fetching={fetching} />
            <ScrollArea style={{ height: 812 }} offsetScrollbars>
              {fetching ? (
                <Skeleton height={36} radius="sm" />
              ) : (
                <TaskCard status={TaskStatus.Canceled} />
              )}
            </ScrollArea>
          </Stack>
        )}
      </SimpleGrid>
    </ScrollArea>
  );
};

const TasksList = ({ taskData, fetching }: TasksProps) => {
  const dataByStatus = (status: TaskStatus) => {
    const data = taskData
      ? taskData
          ?.filter((t: { status: string }) => t.status == status)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      : [];
    return data;
  };

  const TaskList = ({ status }: TaskProps) => {
    return <DndTaskList statusData={dataByStatus(status)} />;
  };

  const Counter = ({ status, fetching }: CounterProps) => {
    return dataByStatus(status).length || fetching ? (
      <StatusCounter taskData={taskData} status={status} />
    ) : (
      <></>
    );
  };

  return (
    <ScrollArea type="hover" offsetScrollbars style={{ height: "calc(100vh - 90px)" }}>
      <Container>
        <Counter status={TaskStatus.None} fetching={fetching} />
        {fetching ? <Skeleton height={36} radius="sm" /> : <TaskList status={TaskStatus.None} />}

        <Counter status={TaskStatus.Backlog} fetching={fetching} />
        {fetching ? <Skeleton height={36} radius="sm" /> : <TaskList status={TaskStatus.Backlog} />}

        <Counter status={TaskStatus.ToDo} fetching={fetching} />
        {fetching ? <Skeleton height={36} radius="sm" /> : <TaskList status={TaskStatus.ToDo} />}

        <Counter status={TaskStatus.InProgress} fetching={fetching} />
        {fetching ? (
          <Skeleton height={36} radius="sm" />
        ) : (
          <TaskList status={TaskStatus.InProgress} />
        )}

        <Counter status={TaskStatus.Done} fetching={fetching} />
        {fetching ? <Skeleton height={36} radius="sm" /> : <TaskList status={TaskStatus.Done} />}

        <Counter status={TaskStatus.Canceled} fetching={fetching} />
        {fetching ? (
          <Skeleton height={36} radius="sm" />
        ) : (
          <TaskList status={TaskStatus.Canceled} />
        )}
      </Container>
    </ScrollArea>
  );
};

const STORAGE_KEY = "filterValues";

export const TasksPageContent = () => {
  const { classes, theme } = useStyles();
  const { setNavBarOpened, setTasks, authCookie } = usePlexoContext();
  const [viewMode, setViewMode] = useState<"list" | "columns">("list");

  const [{ data: tasksData, fetching: isFetchingTasksData }] = useQuery({
    pause: authCookie ? false : true,
    query: TasksDocument,
  });

  //Filters
  let storedFilterValues;

  if (typeof window !== "undefined") {
    storedFilterValues = localStorage.getItem(STORAGE_KEY);
  }

  const filterValuesStorage = storedFilterValues
    ? JSON.parse(storedFilterValues)
    : {
        status: [],
        assignee: [],
        leader: [],
        creator: [],
        priority: [],
        labels: [],
        project: [],
      };

  const [statusFilters, setStatusFilters] = useState<string[]>(filterValuesStorage.status ?? []);
  const [assigneeFilters, setAssigneeFilters] = useState<string[]>(
    filterValuesStorage.assignee ?? []
  );
  const [leaderFilters, setLeaderFilters] = useState<string[]>(filterValuesStorage.leader ?? []);
  const [creatorFilters, setCreatorFilters] = useState<string[]>(filterValuesStorage.creator ?? []);
  const [priorityFilters, setPriorityFilters] = useState<string[]>(
    filterValuesStorage.priority ?? []
  );
  const [labelsFilters, setLabelsFilters] = useState<string[]>(filterValuesStorage.labels ?? []);
  const [projectFilters, setProjectFilters] = useState<string[]>(filterValuesStorage.project ?? []);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const filterValues = {
      status: statusFilters,
      assignee: assigneeFilters,
      leader: leaderFilters,
      creator: creatorFilters,
      priority: priorityFilters,
      labels: labelsFilters,
      project: projectFilters,
    };
    let filtrosTotal = Object.values(filterValues).filter(value => value.length > 0);
    setTotal(filtrosTotal.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filterValues));
  }, [
    statusFilters,
    assigneeFilters,
    leaderFilters,
    creatorFilters,
    priorityFilters,
    labelsFilters,
    projectFilters,
  ]);

  useEffect(() => {
    setViewMode(getCookie("viewMode") === "columns" ? "columns" : "list");
  }, []);

  useEffect(() => {
    setCookie("viewMode", viewMode, {
      maxAge: 30 * 24 * 60 * 60,
    });
  }, [viewMode]);

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData?.tasks);
    }
  }, [tasksData]);

  const filteredTasks = tasksData?.tasks.filter((task: Task) => {
    return (
      (!statusFilters.length || statusFilters.includes(task.status)) &&
      (!assigneeFilters.length ||
        assigneeFilters.every(id => task.assignees.some(t => t.id === id))) &&
      (!leaderFilters.length || leaderFilters.includes(task.leadId)) &&
      (!creatorFilters.length || creatorFilters.includes(task.ownerId)) &&
      (!priorityFilters.length || priorityFilters.includes(task.priority)) &&
      (!labelsFilters.length ||
        labelsFilters.every(filterLabel => task.labels.some(label => label.id === filterLabel))) &&
      (!projectFilters.length || projectFilters.includes(task.projectId))
    );
  });

  return (
    <Stack>
      <Group
        h={73}
        position="apart"
        sx={{
          paddingBottom: theme.spacing.md,
          paddingLeft: theme.spacing.md,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        }}
      >
        <Group pl="md">
          <MediaQuery largerThan="md" styles={{ display: "none" }}>
            <ActionIcon onClick={() => setNavBarOpened(true)}>
              <LayoutSidebar size={16} />
            </ActionIcon>
          </MediaQuery>
          <FilterMenu
            statusFilters={statusFilters}
            setStatusFilters={setStatusFilters}
            assigneeFilters={assigneeFilters}
            setAssigneeFilters={setAssigneeFilters}
            leaderFilters={leaderFilters}
            setLeaderFilters={setLeaderFilters}
            creatorFilters={creatorFilters}
            setCreatorFilters={setCreatorFilters}
            priorityFilters={priorityFilters}
            setPriorityFilters={setPriorityFilters}
            labelsFilters={labelsFilters}
            setLabelsFilters={setLabelsFilters}
            projectFilters={projectFilters}
            setProjectFilters={setProjectFilters}
            total={total}
          />
        </Group>

        <Group pr="md">
          <SegmentedControl
            className={classes["segmented-control"]}
            size={"xs"}
            value={viewMode}
            onChange={value => setViewMode(value as "list" | "columns")}
            transitionTimingFunction="ease"
            data={[
              {
                label: (
                  <Center>
                    <LayoutRows size={16} />
                    <Text className={classes["text-view-buttons"]} ml={6} size={"xs"}>
                      List
                    </Text>
                  </Center>
                ),
                value: "list",
              },
              {
                label: (
                  <Center>
                    <LayoutColumns size={16} />
                    <Text className={classes["text-view-buttons"]} size={"xs"} ml={6}>
                      Board
                    </Text>
                  </Center>
                ),
                value: "columns",
              },
            ]}
          />
        </Group>
      </Group>

      {viewMode === "list" ? (
        <TasksList taskData={filteredTasks} fetching={isFetchingTasksData} />
      ) : (
        <TasksBoard taskData={filteredTasks} fetching={isFetchingTasksData} />
      )}
    </Stack>
  );
};
