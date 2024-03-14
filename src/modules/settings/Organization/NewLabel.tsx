import { Button, ColorInput, Group, Modal, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";

export const NewLabel = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const { createLabel, fetchCreateLabel } = useActions();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      color: "",
    },
    validate: {
      name: val => (val.length <= 2 ? "Name should include at least 2 characters" : null),
      color: val => (val.length <= 2 ? "Color should include at least 2 characters" : null),
    },
  });

  const onCreateLabel = async (values: typeof form.values) => {
    const res = await fetchCreateLabel({
      input: {
        name: values.name,
        description: values.description,
        color: values.color,
      },
    });
    if (res.data) {
      SuccessNotification("Saved!", "The label has been created.");
      close();
      form.reset();
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="New Label">
      <form onSubmit={form.onSubmit(onCreateLabel)}>
        <Stack spacing={10}>
          <ColorInput
            withAsterisk
            placeholder="Pick color"
            label="Label color"
            withEyeDropper={false}
            {...form.getInputProps("color")}
          />
          <TextInput
            withAsterisk
            label="Label name"
            placeholder="Name"
            {...form.getInputProps("name")}
          />

          <Textarea
            autosize
            size="sm"
            label="Description"
            placeholder="Add description..."
            minRows={2}
            {...form.getInputProps("description")}
          />
        </Stack>

        <Group position="right" mt="md">
          <Button type="submit" loading={createLabel.fetching}>
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
