import {
  ActionIcon,
  Button,
  Checkbox,
  createStyles,
  Divider,
  Group,
  Kbd,
  Menu,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  AntennaBars1,
  AntennaBars2,
  AntennaBars3,
  AntennaBars4,
  AntennaBars5,
} from "tabler-icons-react";

import { TaskPriority } from "integration/graphql";
import { useActions } from "lib/hooks/useActions";
import { Task, TaskById } from "lib/types";

import { ErrorNotification, SuccessNotification } from "lib/notifications";

const useStyles = createStyles(theme => ({
  checkbox: {
    width: "100%",
  },
}));

export const PriorityIcon = (
  priority: TaskPriority | undefined,
  size?: string | number | undefined
) => {
  switch (priority) {
    case "NONE":
      return <AntennaBars1 size={size} />;
    case "LOW":
      return <AntennaBars2 size={size} />;
    case "MEDIUM":
      return <AntennaBars3 size={size} />;
    case "HIGH":
      return <AntennaBars4 size={size} />;
    case "URGENT":
      return <AntennaBars5 size={size} />;
    default:
      return <></>;
  }
};

export const priorityLabel = (priority: TaskPriority | undefined) => {
  switch (priority) {
    case "NONE":
      return "None";
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    case "URGENT":
      return "Urgent";
  }

  return "No Priority";
};

export const priorityName = (priority: TaskPriority | undefined) => {
  switch (priority) {
    case "NONE":
      return TaskPriority.None;
    case "LOW":
      return TaskPriority.Low;
    case "MEDIUM":
      return TaskPriority.Medium;
    case "HIGH":
      return TaskPriority.High;
    case "URGENT":
      return TaskPriority.Urgent;
  }
};

const priorityOrder = (a: TaskPriority, b: TaskPriority) => {
  const order = [
    TaskPriority.None,
    TaskPriority.Low,
    TaskPriority.Medium,
    TaskPriority.High,
    TaskPriority.Urgent,
  ];

  const indexA = order.indexOf(a);
  const indexB = order.indexOf(b);

  return indexA - indexB;
};

type PriorityCheckboxProps = {
  priorityFilters: string[];
  setPriorityFilters: (priorityFilters: string[]) => void;
};

export const PriorityCheckboxGroup = ({
  priorityFilters,
  setPriorityFilters,
}: PriorityCheckboxProps) => {
  const { classes } = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [statusOptions, setStatusOptions] = useState<TaskPriority[]>([]);

  useEffect(() => {
    const priorityValues = Object.values(TaskPriority);
    setStatusOptions(
      priorityValues.sort(priorityOrder).filter(item => item.includes(searchValue.toUpperCase()))
    );
  }, [searchValue]);

  return (
    <>
      <TextInput
        placeholder="Priority"
        variant="unstyled"
        value={searchValue}
        onChange={event => setSearchValue(event.currentTarget.value)}
      />
      <Divider />
      <Checkbox.Group mt={10} value={priorityFilters} onChange={setPriorityFilters}>
        {statusOptions.map(priority => {
          return (
            <Checkbox
              key={priority}
              size="xs"
              pb={15}
              value={priority}
              label={
                <Group spacing={5}>
                  {PriorityIcon(priority)}
                  {priorityLabel(priority)}
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
    </>
  );
};

type GenericPriorityMenuProps = {
  children: React.ReactNode;
  onSelect?: (priority: TaskPriority) => void;
  task?: TaskById | Task | undefined;
};

export const GenericPriorityMenu = ({ children, onSelect, task }: GenericPriorityMenuProps) => {
  const { fetchUpdateTask } = useActions();
  const [searchValue, setSearchValue] = useState("");
  const [statusOptions, setStatusOptions] = useState<TaskPriority[]>([]);

  useEffect(() => {
    const priorityValues = Object.values(TaskPriority);
    setStatusOptions(
      priorityValues.sort(priorityOrder).filter(item => item.includes(searchValue.toUpperCase()))
    );
  }, [searchValue]);

  const onUpdateTaskPriority = async (priority: TaskPriority) => {
    const res = await fetchUpdateTask({
      id: task?.id,
      input: {
        priority: priorityName(priority),
      },
    });

    if (res.data) {
      SuccessNotification("Priority updated", res.data.updateTask.title);
    }
    if (res.error) {
      ErrorNotification();
    }
  };
  return (
    <Menu shadow="md" width={180} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Change priority" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <TextInput
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
          placeholder="Change Priority..."
          variant="filled"
          rightSection={<Kbd px={8}>P</Kbd>}
        ></TextInput>
        <Menu.Divider />
        {statusOptions.map(priority => {
          return (
            <Menu.Item
              key={priority}
              icon={PriorityIcon(priority)}
              onClick={() => {
                onSelect && onSelect(priority);
                task && onUpdateTaskPriority(priority);
              }}
            >
              {priorityLabel(priority)}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

type PrioritySelectorProps = {
  priority: TaskPriority;
  setPriority: (priority: TaskPriority) => void;
};

export const PrioritySelector = ({ priority, setPriority }: PrioritySelectorProps) => {
  return (
    <GenericPriorityMenu onSelect={priority => setPriority(priority)}>
      <Button compact variant="light" color={"gray"} leftIcon={PriorityIcon(priority, 18)}>
        <Text size={"xs"}>{priorityLabel(priority)}</Text>
      </Button>
    </GenericPriorityMenu>
  );
};

type PrioritySelectorByTaskProps = {
  task: TaskById | Task | undefined;
  type: "icon" | "button";
  iconVariant?: "light";
};

export const PrioritySelectorByTask = ({
  task,
  type,
  iconVariant,
}: PrioritySelectorByTaskProps) => {
  return (
    <GenericPriorityMenu task={task}>
      {type == "icon" ? (
        <ActionIcon variant={iconVariant ? iconVariant : "transparent"} radius={"sm"}>
          {PriorityIcon(task?.priority)}
        </ActionIcon>
      ) : (
        <Button compact variant="light" color={"gray"} leftIcon={PriorityIcon(task?.priority, 18)}>
          <Text size={"xs"}>{priorityLabel(task?.priority)}</Text>
        </Button>
      )}
    </GenericPriorityMenu>
  );
};
