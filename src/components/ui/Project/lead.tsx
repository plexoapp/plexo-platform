import {
  Button,
  Menu,
  Text,
  TextInput,
  Avatar,
  Skeleton,
  Tooltip,
  Kbd,
  ScrollArea,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { useEffect, useState } from "react";

import { Member, Project, ProjectById } from "lib/types";
import { useActions } from "lib/hooks/useActions";
import { noMemberId } from "../constant";
import { MemberPhoto } from "../MemberPhoto";
import { usePlexoContext } from "context/PlexoContext";

type Payload = {
  id: any;
  name: string;
};

export const LeadName = (lead: Payload | null | undefined) => {
  return lead?.id == noMemberId || lead?.name == undefined || lead.name == null
    ? "Lead"
    : lead.name;
};

type GenericLeadMenuProps = {
  children: React.ReactNode;
  onSelect?: (member: Member | null) => void;
  project?: Project | ProjectById;
  selectedLead?: Member | null;
};

export const GenericLeadProjectMenu = ({
  children,
  onSelect,
  project,
  selectedLead,
}: GenericLeadMenuProps) => {
  const { membersData, isLoadingMembers } = usePlexoContext();
  const { fetchUpdateProject } = useActions();

  const [searchValue, setSearchValue] = useState("");
  const [leadOptions, setLeadOptions] = useState<Member[]>([]);

  const memberName = project?.lead?.name ? project?.lead?.name : selectedLead?.name;

  const onUpdateProjectLead = async (leadId: string) => {
    const res = await fetchUpdateProject({
      id: project?.id,
      input: {
        leadId: leadId,
      },
    });

    if (res.data) {
      showNotification({
        autoClose: 5000,
        title: "Lead updated",
        message: res.data.updateProject.name,
        color: "blue",
        icon: <Check size={18} />,
      });
    }
    if (res.error) {
      showNotification({
        autoClose: 5000,
        title: "Error!",
        message: "Try again",
        color: "red",
        icon: <X size={18} />,
      });
    }
  };

  useEffect(() => {
    if (membersData) {
      searchValue == ""
        ? setLeadOptions(membersData)
        : setLeadOptions(
            membersData?.filter((item: Member) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
          );
    }
  }, [membersData, searchValue]);

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
        <Tooltip
          label={memberName && project?.leadId !== noMemberId ? `Lead by ${memberName}` : "Lead by"}
          position="bottom"
        >
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
        <Menu.Item
          icon={<Avatar size="sm" radius="xl" />}
          onClick={() => {
            onSelect && onSelect(null);
            project && onUpdateProjectLead(noMemberId);
          }}
        >
          Unassigned
        </Menu.Item>
        <ScrollArea.Autosize mah={250}>
          {isLoadingMembers ? (
            <Skeleton height={36} radius="sm" />
          ) : (
            leadOptions.map((m: Member) => {
              return (
                <Menu.Item
                  key={m.id}
                  icon={MemberPhoto(m.photoUrl)}
                  onClick={() => {
                    onSelect && onSelect(m);
                    project && onUpdateProjectLead(m.id);
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

type LeadProjectSelectorProps = {
  lead: Member | null;
  setLead: (lead: Member | null) => void;
};

export const LeadProjectSelector = ({ lead, setLead }: LeadProjectSelectorProps) => {
  return (
    <GenericLeadProjectMenu onSelect={member => setLead(member)} selectedLead={lead}>
      {typeof lead === "undefined" ? (
        <Button compact variant="light" color={"gray"}>
          {MemberPhoto(undefined)}
        </Button>
      ) : (
        <Button compact variant="light" color={"gray"} leftIcon={MemberPhoto(lead?.photoUrl)}>
          <Text size={"xs"}>{LeadName(lead)}</Text>
        </Button>
      )}
    </GenericLeadProjectMenu>
  );
};

type LeadSelectorByProjectProps = {
  project: ProjectById | undefined;
};

export const LeadSelectorByProject = ({ project }: LeadSelectorByProjectProps) => {
  return (
    <GenericLeadProjectMenu project={project}>
      <Button
        compact
        variant="light"
        color={"gray"}
        leftIcon={MemberPhoto(project?.lead?.photoUrl)}
      >
        <Text size={"xs"}>{LeadName(project?.lead)}</Text>
      </Button>
    </GenericLeadProjectMenu>
  );
};
