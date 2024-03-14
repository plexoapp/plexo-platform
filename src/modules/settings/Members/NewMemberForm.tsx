import { Button, Group, Modal, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "urql";

import { RegisterDocument } from "integration/graphql";
import { ErrorNotification, SuccessNotification } from "lib/notifications";

export const NewMemberModal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const [registerNewMemberResult, registerNewMember] = useMutation(RegisterDocument);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: val => (val.length <= 6 ? "Password should include at least 6 characters" : null),
    },
  });

  const onCreateMember = async (values: typeof form.values) => {
    const res = await registerNewMember({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    if (res.data) {
      SuccessNotification("Member created", values.name);
      close();
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Register New Member">
      <form onSubmit={form.onSubmit(onCreateMember)} autoComplete="off">
        <Stack>
          <TextInput
            label="Name"
            placeholder="you@plexo.app"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="you@plexo.app"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps("password")}
          />

          <Group position="right" mt="md">
            <Button type="submit" loading={registerNewMemberResult.fetching}>
              Register
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
