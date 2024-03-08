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
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { LayoutColumns, LayoutRows, LayoutSidebar } from "tabler-icons-react";
import { getCookie, setCookie } from "cookies-next";
import { useQuery } from "urql";

import { TasksDocument, TaskStatus } from "integration/graphql";
import { TaskCardElement, TaskListElement } from "components/ui/Task/task";
import { StatusIcon, statusName } from "components/ui/Task/status";
import { usePlexoContext } from "context/PlexoContext";
import { Task } from "lib/types";
import FilterMenu from "components/ui/Filters/filterMenu";
import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";

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

type TaskBoardProps = {
  statusData: Task[];
  currentStatus: TaskStatus;
};

const DndTaskBoard = ({ statusData, currentStatus }: TaskBoardProps) => {
  return (
    <Droppable droppableId={currentStatus}>
      {provided => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {statusData.map((task: Task, index: number) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCardElement key={task.id} task={{ ...task, status: task.status }} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

type TaskListProps = {
  statusData: Task[];
  currentStatus: TaskStatus;
};

const DndTaskList = ({ statusData, currentStatus }: TaskListProps) => {
  return (
    <Droppable droppableId={currentStatus}>
      {provided => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {statusData.map((task: Task, index: number) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskListElement key={task.id} task={{ ...task, status: task.status }} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

type StatusCounterProps = {
  status: TaskStatus;
  taskData: Task[] | undefined;
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

  const { fetchUpdateTask } = useActions();
  const ChangeTaskStatus = async (status: TaskStatus, taskId: String, fetchUpdateTask: any) => {
    const res = await fetchUpdateTask({
      taskId: taskId,
      status: statusName(status),
    });

    if (res.data) {
      SuccessNotification("Status updated", res.data.updateTask.title);
      return true;

      //move visually droppable element from one column to another
    }
    if (res.error) {
      ErrorNotification();
      return false;
    }
  };

  const initialStatusMap: StatusMap = {
    [TaskStatus.None]: dataByStatus(TaskStatus.None),
    [TaskStatus.Backlog]: dataByStatus(TaskStatus.Backlog),
    [TaskStatus.ToDo]: dataByStatus(TaskStatus.ToDo),
    [TaskStatus.InProgress]: dataByStatus(TaskStatus.InProgress),
    [TaskStatus.Done]: dataByStatus(TaskStatus.Done),
    [TaskStatus.Canceled]: dataByStatus(TaskStatus.Canceled),
  };

  useEffect(() => {
    setColumns(initialStatusMap);
  }, [taskData]);

  type StatusMap = {
    [status in TaskStatus]: Task[];
  };

  const [columns, setColumns] = useState<StatusMap>(initialStatusMap);
  const [ordered, setOrdered] = useState<TaskStatus[]>(
    Object.keys(initialStatusMap) as TaskStatus[]
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination (e.g., item was dropped outside the list), do nothing
    if (!destination) {
      return;
    }

    // If the item was dropped in the same place, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // We update the UI

    // Create a shallow copy of the current columns
    const newColumns = { ...columns };

    // Remove the task from the source column
    const sourceTasks = [...newColumns[source.droppableId as TaskStatus]];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    newColumns[source.droppableId as TaskStatus] = sourceTasks;

    // Add the task to the destination column
    const destinationTasks = [...newColumns[destination.droppableId as TaskStatus]];

    //update the task status visual locally
    movedTask.status = destination.droppableId as TaskStatus;

    // Add the task to the destination column pt2
    destinationTasks.splice(destination.index, 0, movedTask);
    newColumns[destination.droppableId as TaskStatus] = destinationTasks;

    //update the task status visual locally

    // Update the state with the new columns
    setColumns(newColumns);
    setLastUpdated(new Date());

    // Update the task's status in the backend
    const newStatus = destination.droppableId as TaskStatus;
    const wasSuccessful = await ChangeTaskStatus(newStatus, draggableId, fetchUpdateTask);

    // If the backend update was unsuccessful, update the UI to return to the previous position
    if (!wasSuccessful) {
      // Create a shallow copy of the modified columns
      const revertedColumns = { ...newColumns };

      // Remove the task from the destination column
      const currentDestinationTasks = [...revertedColumns[destination.droppableId as TaskStatus]];
      currentDestinationTasks.splice(destination.index, 1);
      revertedColumns[destination.droppableId as TaskStatus] = currentDestinationTasks;

      // Add the task back to the source column at its original position
      const currentSourceTasks = [...revertedColumns[source.droppableId as TaskStatus]];

      //update the task status visual locally
      movedTask.status = source.droppableId as TaskStatus;

      // Add the task back to the source column at its original position pt2
      currentSourceTasks.splice(source.index, 0, movedTask);
      revertedColumns[source.droppableId as TaskStatus] = currentSourceTasks;

      // Update the state with the reverted columns
      setColumns(revertedColumns);
    } else {
      //we need to reload the whole column
    }
    setOrdered(Object.keys(newColumns) as TaskStatus[]);
  };

  return (
    <ScrollArea type="hover" offsetScrollbars style={{ height: "calc(100vh - 90px)" }}>
      <SimpleGrid cols={StatusBoardCols()} spacing={325}>
        <DragDropContext onDragEnd={onDragEnd}>
          {ordered.map(
            (key, index) =>
              StatusBoardEnable(key as TaskStatus) && (
                <Stack key={key} spacing={0} sx={{ minWidth: 312, marginLeft: 20 }}>
                  <Counter status={key as TaskStatus} fetching={fetching} />
                  <ScrollArea style={{ height: 812 }} offsetScrollbars>
                    {fetching ? (
                      <Skeleton height={36} radius="sm" />
                    ) : (
                      <DndTaskBoard statusData={columns[key]} currentStatus={key as TaskStatus} />
                    )}
                  </ScrollArea>
                </Stack>
              )
          )}
        </DragDropContext>
      </SimpleGrid>
    </ScrollArea>
  );
};

type StatusMap = {
  [status in TaskStatus]: Task[];
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

  const Counter = ({ status, fetching }: CounterProps) => {
    return dataByStatus(status).length || fetching ? (
      <StatusCounter taskData={taskData} status={status} />
    ) : (
      <></>
    );
  };

  const { fetchUpdateTask } = useActions();

  const ChangeTaskStatus = async (status: TaskStatus, taskId: String, fetchUpdateTask: any) => {
    const res = await fetchUpdateTask({
      taskId: taskId,
      status: statusName(status),
    });

    if (res.data) {
      SuccessNotification("Status updated", res.data.updateTask.title);
      return true;

      //move visually droppable element from one column to another
    }
    if (res.error) {
      ErrorNotification();
      return false;
    }
  };

  const initialStatusMap: StatusMap = {
    [TaskStatus.None]: dataByStatus(TaskStatus.None),
    [TaskStatus.Backlog]: dataByStatus(TaskStatus.Backlog),
    [TaskStatus.ToDo]: dataByStatus(TaskStatus.ToDo),
    [TaskStatus.InProgress]: dataByStatus(TaskStatus.InProgress),
    [TaskStatus.Done]: dataByStatus(TaskStatus.Done),
    [TaskStatus.Canceled]: dataByStatus(TaskStatus.Canceled),
  };

  useEffect(() => {
    setColumns(initialStatusMap);
  }, [taskData]);

  const [columns, setColumns] = useState<StatusMap>(initialStatusMap);
  const [ordered, setOrdered] = useState<TaskStatus[]>(
    Object.keys(initialStatusMap) as TaskStatus[]
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination (e.g., item was dropped outside the list), do nothing
    if (!destination) {
      return;
    }

    // If the item was dropped in the same place, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // We update the UI

    // Create a shallow copy of the current columns
    const newColumns = { ...columns };

    // Remove the task from the source column
    const sourceTasks = [...newColumns[source.droppableId as TaskStatus]];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    newColumns[source.droppableId as TaskStatus] = sourceTasks;

    // Add the task to the destination column
    const destinationTasks = [...newColumns[destination.droppableId as TaskStatus]];

    //update the task status visual locally
    movedTask.status = destination.droppableId as TaskStatus;

    // Add the task to the destination column pt2
    destinationTasks.splice(destination.index, 0, movedTask);
    newColumns[destination.droppableId as TaskStatus] = destinationTasks;

    // Update the state with the new columns
    setColumns(newColumns);
    setLastUpdated(new Date());

    // Update the task's status in the backend
    const newStatus = destination.droppableId as TaskStatus;
    const wasSuccessful = await ChangeTaskStatus(newStatus, draggableId, fetchUpdateTask);

    // If the backend update was unsuccessful, update the UI to return to the previous position
    if (!wasSuccessful) {
      // Create a shallow copy of the modified columns
      const revertedColumns = { ...newColumns };

      // Remove the task from the destination column
      const currentDestinationTasks = [...revertedColumns[destination.droppableId as TaskStatus]];
      currentDestinationTasks.splice(destination.index, 1);
      revertedColumns[destination.droppableId as TaskStatus] = currentDestinationTasks;

      // Add the task back to the source column at its original position
      const currentSourceTasks = [...revertedColumns[source.droppableId as TaskStatus]];

      //update the task status visual locally
      movedTask.status = source.droppableId as TaskStatus;

      // Add the task back to the source column at its original position pt2
      currentSourceTasks.splice(source.index, 0, movedTask);
      revertedColumns[source.droppableId as TaskStatus] = currentSourceTasks;

      // Update the state with the reverted columns
      setColumns(revertedColumns);
    } else {
      //we need to reload the whole column
    }
    setOrdered(Object.keys(newColumns) as TaskStatus[]);
  };

  return (
    <ScrollArea type="hover" offsetScrollbars style={{ height: "calc(100vh - 90px)" }}>
      <Container>
        <DragDropContext onDragEnd={onDragEnd}>
          {ordered.map((key, index) => (
            <Stack key={key} spacing={0} sx={{ minWidth: 312, marginLeft: 20 }}>
              <Counter status={key as TaskStatus} fetching={fetching} />
              {fetching ? (
                <Skeleton height={36} radius="sm" />
              ) : (
                <DndTaskList statusData={columns[key]} currentStatus={key as TaskStatus} />
              )}
            </Stack>
          ))}
        </DragDropContext>
      </Container>
    </ScrollArea>
  );
};

const STORAGE_KEY = "filterValues";

export const TasksPageContent = () => {
  const { classes, theme } = useStyles();
  const { setNavBarOpened, setTasks } = usePlexoContext();
  const [viewMode, setViewMode] = useState<"list" | "columns">("list");

  const [{ data: tasksData, fetching: isFetchingTasksData }] = useQuery({
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
    let totalFilters = Object.values(filterValues).filter(value => value.length > 0);
    setTotal(totalFilters.length);
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
          padding: theme.spacing.md,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          "&:not(:last-of-type)": {
            borderBottom: `1px solid ${
              theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
          },
        }}
      >
        <Group>
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

        <Group>
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
