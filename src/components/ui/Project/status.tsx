import {
  Button,
  Kbd,
  Menu,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
  MantineTheme,
  Checkbox,
  createStyles,
  Group,
  Divider,
  ActionIcon,
} from "@mantine/core";
import { ProjectStatus } from "integration/graphql";
import {
  Circle,
  CircleCheck,
  CircleDot,
  CircleX,
  CircleDotted,
  ChartPie2,
} from "tabler-icons-react";
import { useState, useEffect } from "react";

import { ProjectById } from "lib/types";

import { useActions } from "lib/hooks/useActions";

import { ErrorNotification, SuccessNotification } from "lib/notifications";

const useStyles = createStyles(theme => ({
  checkbox: {
    width: "100%",
  },
}));

export const StatusIcon = (
  theme: MantineTheme,
  status?: ProjectStatus,
  size: string | number | undefined = 18
) => {
  switch (status) {
    case "NONE":
      return <CircleDot size={size} color={theme.colors.gray[6]} />;
    case "BACKLOG":
      return <CircleDotted size={size} color={theme.colors.gray[6]} />;
    case "TO_DO":
      return <Circle size={size} color={theme.colors.gray[6]} />;
    case "IN_PROGRESS":
      return <ChartPie2 size={size} color={theme.colors.yellow[6]} />;
    case "DONE":
      return <CircleCheck size={size} color={theme.colors.indigo[6]} />;
    case "CANCELED":
      return <CircleX size={size} color={theme.colors.red[6]} />;
    default:
      return <></>;
  }
};

export const statusLabel = (status?: ProjectStatus) => {
  switch (status) {
    case "NONE":
      return "None";
    case "BACKLOG":
      return "Backlog";
    case "TO_DO":
      return "Todo";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Done";
    case "CANCELED":
      return "Canceled";
  }

  return "No Status";
};

export const statusName = (status: ProjectStatus | undefined) => {
  switch (status) {
    case "NONE":
      return ProjectStatus.None;
    case "BACKLOG":
      return ProjectStatus.Backlog;
    case "TO_DO":
      return ProjectStatus.ToDo;
    case "IN_PROGRESS":
      return ProjectStatus.InProgress;

    case "DONE":
      return ProjectStatus.Done;
    case "CANCELED":
      return ProjectStatus.Canceled;
  }
};

const statusOrder = (a: ProjectStatus, b: ProjectStatus) => {
  const order = [
    ProjectStatus.None,
    ProjectStatus.Backlog,
    ProjectStatus.ToDo,
    ProjectStatus.InProgress,
    ProjectStatus.Done,
    ProjectStatus.Canceled,
  ];

  const indexA = order.indexOf(a);
  const indexB = order.indexOf(b);

  return indexA - indexB;
};

type StatusCheckboxProps = {
  statusFilters: string[];
  setStatusFilters: (statusFilters: string[]) => void;
};

export const StatusProjectCheckboxGroup = ({
  statusFilters,
  setStatusFilters,
}: StatusCheckboxProps) => {
  const { classes, theme } = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [statusOptions, setStatusOptions] = useState<ProjectStatus[]>([]);

  useEffect(() => {
    const statusValues = Object.values(ProjectStatus);
    setStatusOptions(
      statusValues.sort(statusOrder).filter(item => item.includes(searchValue.toUpperCase()))
    );
  }, [searchValue]);

  return (
    <>
      <TextInput
        placeholder="Status"
        variant="unstyled"
        value={searchValue}
        onChange={event => setSearchValue(event.currentTarget.value)}
      />
      <Divider />
      <Checkbox.Group mt={10} value={statusFilters} onChange={setStatusFilters}>
        {statusOptions.map(status => {
          return (
            <Checkbox
              key={status}
              size="xs"
              pb={15}
              value={status}
              label={
                <Group spacing={5}>
                  {StatusIcon(theme, status)}
                  {statusLabel(status)}
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

type GenericStatusMenuProps = {
  children: React.ReactNode;
  onSelect?: (priority: ProjectStatus) => void;
  project?: ProjectById;
};

export const GenericStatusProjectMenu = ({
  children,
  onSelect,
  project,
}: GenericStatusMenuProps) => {
  const theme = useMantineTheme();
  const { fetchUpdateProject } = useActions();
  const [searchValue, setSearchValue] = useState("");
  const [statusOptions, setStatusOptions] = useState<ProjectStatus[]>([]);

  useEffect(() => {
    const statusValues = Object.values(ProjectStatus);
    setStatusOptions(
      statusValues.sort(statusOrder).filter(item => item.includes(searchValue.toUpperCase()))
    );
  }, [searchValue]);

  const onUpdateProjectStatus = async (status: ProjectStatus) => {
    const res = await fetchUpdateProject({
      id: project?.id,
      input: {
        status: statusName(status),
      },
    });

    if (res.data) {
      SuccessNotification("Status updated", res.data.updateProject.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Menu shadow="md" width={180} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Change status" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <TextInput
          placeholder="Change Status..."
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
          rightSection={<Kbd px={8}>S</Kbd>}
        />
        <Menu.Divider />
        {statusOptions.map(status => {
          return (
            <Menu.Item
              key={status}
              icon={StatusIcon(theme, status)}
              onClick={() => {
                onSelect && onSelect(status);
                project && onUpdateProjectStatus(status);
              }}
            >
              {statusLabel(status)}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

type StatusSelectorProps = {
  status: ProjectStatus;
  setStatus: (status: ProjectStatus) => void;
  type: "icon" | "button";
};

export const StatusProjectSelector = ({ status, setStatus, type }: StatusSelectorProps) => {
  const theme = useMantineTheme();

  return (
    <GenericStatusProjectMenu onSelect={s => setStatus(s)}>
      {type == "icon" ? (
        <ActionIcon variant="transparent" radius={"sm"}>
          {StatusIcon(theme, status)}
        </ActionIcon>
      ) : (
        <Button compact variant="light" color={"gray"} leftIcon={StatusIcon(theme, status, 18)}>
          <Text size={"xs"}>{statusLabel(status)}</Text>
        </Button>
      )}
    </GenericStatusProjectMenu>
  );
};

type StatusSelectorByProjectProps = {
  project: ProjectById | undefined;
  type: "icon" | "button";
  iconVariant?: "light";
};

export const StatusSelectorByProject = ({
  project,
  type,
  iconVariant,
}: StatusSelectorByProjectProps) => {
  const theme = useMantineTheme();

  return (
    <GenericStatusProjectMenu project={project}>
      {type == "icon" ? (
        <ActionIcon variant={iconVariant ? iconVariant : "transparent"} radius={"sm"}>
          {StatusIcon(theme, project?.status)}
        </ActionIcon>
      ) : (
        <Button
          compact
          variant="light"
          color={"gray"}
          leftIcon={StatusIcon(theme, project?.status)}
        >
          <Text size={"xs"}>{statusLabel(project?.status)}</Text>
        </Button>
      )}
    </GenericStatusProjectMenu>
  );
};
