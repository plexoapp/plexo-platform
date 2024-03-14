import { Button, Group, Modal, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "urql";

import { UpdatePasswordDocument } from "integration/graphql";
import { ErrorNotification, SuccessNotification } from "lib/notifications";

type PasswordFormProps = {
  opened: boolean;
  close: () => void;
};

export const PasswordForm = ({ opened, close }: PasswordFormProps) => {
  const [updatePasswordResult, updatePassword] = useMutation(UpdatePasswordDocument);

  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validate: {
      currentPassword: val =>
        val.length <= 6 ? "Password should include at least 6 characters" : null,
      newPassword: (value, values) =>
        value == values.currentPassword && value.length > 1
          ? "Passwords can not be the same"
          : value.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const onUpdatePassword = async (values: typeof form.values) => {
    const res = await updatePassword({
      input: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
    });

    if (res.data) {
      SuccessNotification("Saved!", "Your password has been updated.");
      close();
      form.reset();
    }

    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Change Password">
      <form onSubmit={form.onSubmit(onUpdatePassword)}>
        <Stack>
          <PasswordInput
            label="Current Password"
            placeholder="Password"
            withAsterisk
            {...form.getInputProps("currentPassword")}
          />
          <PasswordInput
            label="New Password"
            placeholder="Password"
            withAsterisk
            {...form.getInputProps("newPassword")}
          />

          <Group position="right" mt="md">
            <Button type="submit" loading={updatePasswordResult.fetching}>
              Save password
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
