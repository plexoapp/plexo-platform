import {
  ActionIcon,
  Avatar,
  Button,
  Checkbox,
  Container,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Edit } from "tabler-icons-react";

import { UpdateMemberModal } from "./UpdateMemberForm";
import { NewMemberModal } from "./NewMemberForm";
import { usePlexoContext } from "context/PlexoContext";
import { MemberRole } from "integration/graphql";

const useStyles = createStyles(theme => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export interface MemberProps {
  avatar: string;
  name: string;
  role: string;
  email: string;
  job: string;
  id: string;
  createdAt: string;
}

interface MembersSectionProps {
  data: MemberProps[];
}

const EditMemberAction = ({ member }: { member: MemberProps }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <ActionIcon>
        <Edit size={18} onClick={open} />
      </ActionIcon>
      <UpdateMemberModal opened={opened} close={close} member={member} />
    </>
  );
};

export const MembersSection = ({ data }: MembersSectionProps) => {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState(["1"]);
  const [opened, { open, close }] = useDisclosure(false);

  const { userData } = usePlexoContext();
  const isAdmin = userData?.role === MemberRole.Admin;

  const toggleRow = (id: string) =>
    setSelection(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection(current => (current.length === data.length ? [] : data.map(item => item.id)));

  const rows = data
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(item => {
      const selected = selection.includes(item.id);
      return (
        <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
          <td>
            {isAdmin && (
              <Checkbox
                checked={selection.includes(item.id)}
                onChange={() => toggleRow(item.id)}
                transitionDuration={0}
              />
            )}
          </td>
          <td>
            <Group spacing="sm">
              <Avatar size={26} src={item.avatar} radius={26} color="brand">
                {item.name[0]}
              </Avatar>
              <Text size="sm" weight={500}>
                {item.name}
              </Text>
            </Group>
          </td>
          <td>{item.email}</td>
          <td>{item.job}</td>
          {isAdmin && (
            <td>
              <EditMemberAction member={item} />
            </td>
          )}
        </tr>
      );
    });

  return (
    <Container size={"lg"}>
      <NewMemberModal opened={opened} close={close} />
      <Stack>
        {isAdmin && (
          <Group position="right">
            <Button compact onClick={open}>
              Create Member
            </Button>
          </Group>
        )}
        <ScrollArea>
          <Table miw={800} verticalSpacing="sm">
            <thead>
              <tr>
                <th style={{ width: rem(40) }}>
                  {isAdmin && (
                    <Checkbox
                      onChange={toggleAll}
                      checked={selection.length === data.length}
                      indeterminate={selection.length > 0 && selection.length !== data.length}
                      transitionDuration={0}
                    />
                  )}
                </th>
                <th>User</th>
                <th>Email</th>
                <th>Job</th>
                {isAdmin && <th>Edit</th>}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Container>
  );
};
