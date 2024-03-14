import { Button, ColorInput, Group, Modal, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { Label } from "lib/types";
import { useEffect } from "react";

export const UpdateLabel = ({
  label,
  opened,
  close,
}: {
  label: Label | undefined;
  opened: boolean;
  close: () => void;
}) => {
  const { updateLabel, fetchUpdateLabel } = useActions();

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

  const onUpdateLabel = async (values: typeof form.values) => {
    const res = await fetchUpdateLabel({
      id: label?.id,
      input: {
        name: values.name,
        description: values.description,
        color: values.color,
      },
    });
    if (res.data) {
      SuccessNotification("Saved!", "The label has been updated.");
      close();
      form.reset();
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  useEffect(() => {
    form.setValues({
      name: label?.name || "",
      description: label?.description || "",
      color: label?.color || "",
    });
  }, [label]);

  return (
    <Modal opened={opened} onClose={close} title="Edit Label">
      <form onSubmit={form.onSubmit(onUpdateLabel)}>
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
          <Button type="submit" loading={updateLabel.fetching}>
            Save changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
