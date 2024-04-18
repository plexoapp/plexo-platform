import {
  Button,
  Kbd,
  Menu,
  Text,
  TextInput,
  Avatar,
  Skeleton,
  Tooltip,
  ScrollArea,
  ActionIcon,
} from "@mantine/core";
import { useEffect, useState } from "react";

import { Member, Task, TaskById } from "lib/types";
import { useActions } from "lib/hooks/useActions";

import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { LeadName } from "../Project/lead";
import { noMemberId } from "../constant";
import { MemberPhoto } from "../MemberPhoto";
import { usePlexoContext } from "context/PlexoContext";
import { ProjectTask } from "../Project/DesignProject/projectTasks";
import { TaskChat } from "../Chat/Messages/TaskMessage";

type GenericLeadMenuProps = {
  children: React.ReactNode;
  onSelect?: (member: Member | null) => void;
  task?: Task | TaskById;
  selectedLead?: Member | null;
};

export const GenericLeadTaskMenu = ({
  children,
  onSelect,
  task,
  selectedLead,
}: GenericLeadMenuProps) => {
  const { membersData, isLoadingMembers } = usePlexoContext();
  const { fetchUpdateTask } = useActions();
  const [searchValue, setSearchValue] = useState("");
  const [membersOptions, setMembersOptions] = useState<Member[]>([]);
  const leadName = task?.lead?.name ? task?.lead?.name : selectedLead?.name;

  useEffect(() => {
    if (membersData) {
      setMembersOptions(
        membersData?.filter((item: Member) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [membersData, searchValue]);

  const onUpdateTaskLead = async (leadId: string) => {
    const res = await fetchUpdateTask({
      id: task?.id,
      input: {
        leadId: leadId,
      },
    });
    if (res.data) {
      SuccessNotification("Lead updated", res.data.updateTask.title);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Menu
      shadow="md"
      position="bottom-start"
      withinPortal
      styles={{
        itemIcon: {
          width: 26,
          height: 26,
        },
      }}
    >
      <Menu.Target>
        <Tooltip label={leadName ? `Lead by ${leadName}` : "Lead by"} position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <TextInput
          placeholder="Lead by..."
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
          rightSection={<Kbd px={8}>A</Kbd>}
        ></TextInput>
        <Menu.Divider />
        <ScrollArea.Autosize mah={250}>
          <Menu.Item
            icon={<Avatar size="sm" radius="xl" />}
            onClick={() => {
              onSelect && onSelect(null);
              task && onUpdateTaskLead(noMemberId);
            }}
          >
            Unassigned
          </Menu.Item>
          {isLoadingMembers ? (
            <Skeleton height={36} radius="sm" />
          ) : (
            membersOptions.map(m => {
              return (
                <Menu.Item
                  key={m.id}
                  icon={MemberPhoto(m)}
                  onClick={() => {
                    onSelect && onSelect(m);
                    task && onUpdateTaskLead(m.id);
                  }}
                >
                  {m.name}
                </Menu.Item>
              );
            })
          )}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

type ManualLeadMenuProps<T extends Payload> = {
  children: React.ReactNode;
  task: T;
  tasks: T[];
  setTasks: SetTasksFunction<T>;
  suggestedLeadId?: string | null;
};

export const ManualLeadTaskMenu = <T extends Payload>({
  children,
  task,
  tasks,
  setTasks,
  suggestedLeadId,
}: ManualLeadMenuProps<T>) => {
  const { membersData, isLoadingMembers } = usePlexoContext();

  const [searchValue, setSearchValue] = useState("");
  const [membersOptions, setMembersOptions] = useState<Member[]>([]);
  const leadName = task?.lead?.name;

  useEffect(() => {
    if (membersData) {
      setMembersOptions(
        membersData?.filter((item: Member) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [membersData, searchValue]);

  const onUpdateTaskLead = async (lead: Member | null) => {
    const updatedTasks = tasks.map(t => {
      return task.id == t.id ? { ...t, lead: lead } : t;
    });
    setTasks(updatedTasks);
  };

  useEffect(() => {
    if (suggestedLeadId) {
      let objeto = tasks.find(obj => obj.id === task.id);
      const leadSug = membersOptions.filter(member => member.id == suggestedLeadId)[0];
      if (objeto) {
        objeto.lead = leadSug ? leadSug : null;
      }

      // Actualizar lista de tareas
      const updatedTasks = tasks.map(item => item);
      setTasks([...updatedTasks]);
    }
  }, [membersOptions]);

  return (
    <Menu
      shadow="md"
      position="bottom-start"
      withinPortal
      styles={{
        itemIcon: {
          width: 26,
          height: 26,
        },
      }}
    >
      <Menu.Target>
        <Tooltip label={leadName ? `Lead by ${leadName}` : "Lead by"} position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <TextInput
          placeholder="Lead by..."
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
          rightSection={<Kbd px={8}>A</Kbd>}
        ></TextInput>
        <Menu.Divider />
        <ScrollArea.Autosize mah={250}>
          <Menu.Item icon={<Avatar size="sm" radius="xl" />} onClick={() => onUpdateTaskLead(null)}>
            Unassigned
          </Menu.Item>
          {isLoadingMembers ? (
            <Skeleton height={36} radius="sm" />
          ) : (
            membersOptions.map(m => {
              return (
                <Menu.Item key={m.id} icon={MemberPhoto(m)} onClick={() => onUpdateTaskLead(m)}>
                  {m.name}
                </Menu.Item>
              );
            })
          )}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

type SetTasksFunction<T extends Payload> = (tasks: T[]) => void;

type Payload = ProjectTask | TaskChat;

type ManualLeadTaskSelectorProps<T extends Payload> = {
  task: T;
  tasks: T[];
  setTasks: SetTasksFunction<T>;
  suggestedLeadId?: string | null;
};

export const ManualLeadTaskSelector = <T extends Payload>({
  task,
  tasks,
  setTasks,
  suggestedLeadId,
}: ManualLeadTaskSelectorProps<T>) => {
  return (
    <ManualLeadTaskMenu
      task={task}
      tasks={tasks}
      setTasks={setTasks}
      suggestedLeadId={suggestedLeadId}
    >
      <ActionIcon variant="transparent">{MemberPhoto(task.lead)}</ActionIcon>
    </ManualLeadTaskMenu>
  );
};

type LeadTaskSelectorProps = {
  lead: Member | null;
  setLead: (lead: Member | null) => void;
  type: "icon" | "button";
};

export const LeadTaskSelector = ({ lead, setLead, type }: LeadTaskSelectorProps) => {
  return (
    <GenericLeadTaskMenu onSelect={member => setLead(member)} selectedLead={lead}>
      {type == "icon" ? (
        <ActionIcon variant="transparent">{MemberPhoto(lead)}</ActionIcon>
      ) : (
        <Button compact variant="light" color={"gray"} leftIcon={MemberPhoto(lead)}>
          <Text size={"xs"}>{LeadName(lead)}</Text>
        </Button>
      )}
    </GenericLeadTaskMenu>
  );
};

type LeadSelectorByTaskProps = {
  task: Task | TaskById | undefined;
  type: "icon" | "button";
};

export const LeadSelectorByTask = ({ task, type }: LeadSelectorByTaskProps) => {
  return (
    <GenericLeadTaskMenu task={task}>
      {type == "icon" ? (
        <ActionIcon variant="transparent">{MemberPhoto(task?.lead)}</ActionIcon>
      ) : (
        <Button compact variant="light" color={"gray"} leftIcon={MemberPhoto(task?.lead)}>
          <Text size={"xs"}>{LeadName(task?.lead)}</Text>
        </Button>
      )}
    </GenericLeadTaskMenu>
  );
};
