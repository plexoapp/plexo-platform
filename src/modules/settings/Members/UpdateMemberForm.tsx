import { Button, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "urql";

import { UpdateMemberDocument, MemberRole } from "integration/graphql";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { MemberProps } from ".";

const getRole = (role: string) => {
  switch (role) {
    case "MEMBER":
      return MemberRole.Member;
    case "ADMIN":
      return MemberRole.Admin;
    default:
      return MemberRole.ReadOnly;
  }
};

export const UpdateMemberModal = ({
  opened,
  close,
  member,
}: {
  opened: boolean;
  close: () => void;
  member: MemberProps | null;
}) => {
  const [updateMemberResult, updateMember] = useMutation(UpdateMemberDocument);

  const form = useForm({
    initialValues: {
      name: member?.name || "",
      email: member?.email || "",
      role: member?.role || "",
    },
    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const onUpdateMember = async (values: typeof form.values) => {
    const res = await updateMember({
      id: member?.id,
      input: {
        name: values.name,
        email: values.email,
        role: getRole(values.role),
      },
    });
    if (res.data) {
      SuccessNotification("Member updated", values.name);
      close();
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Update Member">
      <form onSubmit={form.onSubmit(onUpdateMember)}>
        <Stack>
          <TextInput label="Name" placeholder="you@plexo.app" {...form.getInputProps("name")} />
          <TextInput label="Email" placeholder="you@plexo.app" {...form.getInputProps("email")} />
          <Select
            withinPortal
            label="Role"
            data={[
              { value: "ADMIN", label: "Admin" },
              { value: "MEMBER", label: "Member" },
              { value: "READ_ONLY", label: "Read only" },
            ]}
            {...form.getInputProps("role")}
          />

          <Group position="right" mt="md">
            <Button type="submit" loading={updateMemberResult.fetching}>
              Update
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
