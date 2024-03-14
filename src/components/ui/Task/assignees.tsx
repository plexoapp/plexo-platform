import {
  Button,
  Menu,
  Text,
  TextInput,
  Skeleton,
  Checkbox,
  Tooltip,
  Divider,
  ScrollArea,
  Box,
  createStyles,
} from "@mantine/core";
import { Users } from "tabler-icons-react";
import { ChangeEvent, useEffect, useState } from "react";

import { Member, TaskById } from "lib/types";
import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";

import { MemberInfo } from "components/ui/Project/members";
import { usePlexoContext } from "context/PlexoContext";

const useStyles = createStyles(theme => ({
  checkboxBody: {
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    paddingLeft: 5,
  },
  checkboxInner: {
    width: 20,
    height: 20,
  },
  checkboxInput: {
    width: "100%",
    height: "100%",
  },
}));

export const AssigneesIcon = () => {
  return <Users size={16} />;
};

const AssigneeName = (assignees: number | undefined) => {
  return assignees && assignees >= 1 ? `${assignees} Assignees` : "Assignees";
};

type MembersCheckboxProps = {
  selectedMembers: string[];
  setSelectedMembers: (selectedMembers: string[]) => void;
  inputPlaceholder: string;
};

export const MembersCheckboxGroup = ({
  selectedMembers,
  setSelectedMembers,
  inputPlaceholder,
}: MembersCheckboxProps) => {
  const { membersData } = usePlexoContext();
  const [searchValue, setSearchValue] = useState("");
  const [membersOptions, setMembersOptions] = useState<Member[]>([]);

  useEffect(() => {
    if (membersData) {
      setMembersOptions(
        membersData?.filter((item: Member) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue]);

  return (
    <>
      <TextInput
        placeholder={inputPlaceholder}
        variant="unstyled"
        value={searchValue}
        onChange={event => setSearchValue(event.currentTarget.value)}
      />
      <Divider />
      <ScrollArea.Autosize mah={250}>
        <Checkbox.Group mt={10} value={selectedMembers} onChange={setSelectedMembers}>
          {membersOptions.map(m => {
            return (
              <Checkbox
                key={m.id}
                size="xs"
                pb={15}
                value={m.id}
                label={MemberInfo(m)}
                styles={{
                  body: {
                    alignItems: "center",
                  },
                  label: {
                    paddingLeft: 5,
                  },
                }}
              />
            );
          })}
        </Checkbox.Group>
      </ScrollArea.Autosize>
    </>
  );
};

type GenericAssigneesMenuProps = {
  children: React.ReactNode;
  selectedAssignees?: string[];
  setSelectedAssignees?: (selectedAssignees: string[]) => void;
};

const GenericAssigneesMenu = ({
  children,
  selectedAssignees,
  setSelectedAssignees,
}: GenericAssigneesMenuProps) => {
  const { membersData, isLoadingMembers } = usePlexoContext();
  const [searchValue, setSearchValue] = useState("");
  const [membersOptions, setMembersOptions] = useState<Member[]>([]);

  useEffect(() => {
    if (membersData) {
      searchValue == ""
        ? setMembersOptions(membersData)
        : setMembersOptions(
            membersData?.filter((item: Member) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          );
    }
  }, [membersData, searchValue]);

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Change assigness" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder="Change assigness"
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
        ></TextInput>
        <Menu.Divider />
        <ScrollArea.Autosize mah={250}>
          {isLoadingMembers ? (
            <Skeleton height={36} radius="sm" />
          ) : (
            <Checkbox.Group mt={10} value={selectedAssignees} onChange={setSelectedAssignees}>
              {membersOptions.map(m => {
                return (
                  <Menu.Item key={m.id}>
                    <Checkbox
                      size="xs"
                      value={m.id}
                      label={MemberInfo(m)}
                      styles={{
                        body: {
                          alignItems: "center",
                        },
                        label: {
                          paddingLeft: 5,
                        },
                      }}
                    />
                  </Menu.Item>
                );
              })}
            </Checkbox.Group>
          )}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

type AssigneesByTaskMenuProps = {
  children: React.ReactNode;
  task?: TaskById;
};

const AssigneesByTaskMenu = ({ children, task }: AssigneesByTaskMenuProps) => {
  const { classes } = useStyles();
  const { membersData, isLoadingMembers } = usePlexoContext();
  const { fetchUpdateTask } = useActions();
  const [searchValue, setSearchValue] = useState("");
  const [membersOptions, setMembersOptions] = useState<Member[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  useEffect(() => {
    if (membersData) {
      searchValue == ""
        ? setMembersOptions(membersData)
        : setMembersOptions(
            membersData?.filter((item: Member) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          );
    }
  }, [membersData, searchValue]);

  useEffect(() => {
    if (task && task.assignees) {
      const assigneeIds = task.assignees.map(a => a.id as string);

      setSelectedAssignees(assigneeIds);
    }
  }, [task]);

  const onUpdateTaskAssignees = async (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.currentTarget;
    setSelectedAssignees(
      checked ? [...selectedAssignees, value] : selectedAssignees.filter(a => a !== value)
    );

    const res = await fetchUpdateTask({
      id: task?.id,
      input: {
        assignees: {
          add: checked ? [value] : [],
          remove: checked ? [] : [value],
        },
      },
    });

    if (res.data) {
      SuccessNotification("Assigness updated", res.data.updateTask.title);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Assignees" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder="Change assigness"
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
        ></TextInput>
        <Menu.Divider />
        <ScrollArea.Autosize mah={250}>
          {isLoadingMembers ? (
            <Skeleton height={36} radius="sm" />
          ) : (
            <Box mt={10}>
              {membersOptions.map(m => {
                return (
                  <Menu.Item key={m.id}>
                    <Checkbox
                      size="xs"
                      value={m.id}
                      label={MemberInfo(m)}
                      checked={selectedAssignees.includes(m.id)}
                      onChange={event => onUpdateTaskAssignees(event)}
                      classNames={{
                        body: classes.checkboxBody,
                        label: classes.checkboxLabel,
                        inner: classes.checkboxInner,
                        input: classes.checkboxInput,
                      }}
                    />
                  </Menu.Item>
                );
              })}
            </Box>
          )}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

type AssigneesSelectorProps = {
  selectedAssignees: string[];
  setSelectedAssignees: (selectedLabels: string[]) => void;
};

export const AssigneesSelector = ({
  selectedAssignees,
  setSelectedAssignees,
}: AssigneesSelectorProps) => {
  return (
    <GenericAssigneesMenu
      selectedAssignees={selectedAssignees}
      setSelectedAssignees={setSelectedAssignees}
    >
      <Button compact variant="light" color={"gray"} leftIcon={<AssigneesIcon />}>
        <Text size={"xs"}>{AssigneeName(selectedAssignees.length)}</Text>
      </Button>
    </GenericAssigneesMenu>
  );
};

type AssigneesSelectorByTaskProps = {
  task: TaskById | undefined;
};

export const AssigneesSelectorByTask = ({ task }: AssigneesSelectorByTaskProps) => {
  return (
    <AssigneesByTaskMenu task={task}>
      <Button compact variant="light" color={"gray"} leftIcon={<AssigneesIcon />}>
        <Text size={"xs"}>{AssigneeName(task?.assignees.length)}</Text>
      </Button>
    </AssigneesByTaskMenu>
  );
};
