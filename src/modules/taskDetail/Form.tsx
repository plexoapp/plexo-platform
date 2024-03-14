import { Button, Group, Skeleton, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { TaskById } from "lib/types";
import { useEffect } from "react";

type TitleFormProps = {
  task: TaskById | undefined;
  isLoading: boolean;
};

const validateDescription = (description: string | null | undefined) => {
  return description ? description : "";
};

export const TitleForm = ({ task, isLoading }: TitleFormProps) => {
  const { updateTask, fetchUpdateTask } = useActions();

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
    },

    validate: {
      title: value => (value.length < 2 ? "Task must have at least 2 letters" : null),
    },
  });

  const onUpdateTask = async (values: typeof form.values) => {
    const res = await fetchUpdateTask({
      id: task?.id,
      input: {
        title: values.title,
        description: values.description,
      },
    });

    if (res.data) {
      SuccessNotification("Task updated", res.data.updateTask.title);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  useEffect(() => {
    if (task) {
      form.setValues({ title: task.title, description: validateDescription(task.description) });
    }
  }, [task]);

  const enableSaveButton =
    form.values.title !== "" &&
    (form.values.title !== task?.title ||
      form.values.description !== validateDescription(task?.description))
      ? false
      : true;

  return isLoading ? (
    <Stack>
      <Skeleton height={50} />
      <Skeleton height={66} />
    </Stack>
  ) : (
    <form onSubmit={form.onSubmit(onUpdateTask)}>
      <Stack mb={"xl"}>
        <TextInput
          size="lg"
          variant="filled"
          placeholder="Task Title"
          styles={theme => ({
            input: {
              fontSize: 22,
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
            },
          })}
          {...form.getInputProps("title")}
        />

        <Textarea
          autosize
          size="sm"
          placeholder="Add description..."
          minRows={2}
          variant="filled"
          styles={theme => ({
            input: {
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
            },
          })}
          {...form.getInputProps("description")}
        />
        <Group position="right">
          <Button compact type="submit" disabled={enableSaveButton} loading={updateTask.fetching}>
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
