import { Button, Group, Skeleton, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import EditorJS, { OutputData } from "@editorjs/editorjs";

import { EditorInput } from "components/ui/Editor/EditorInput";
import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { TaskById } from "lib/types";
import { useEffect, useState } from "react";
import { parseJsonDesc } from "lib/utils";

type TitleFormProps = {
  task: TaskById | undefined;
  isLoading: boolean;
};

const validateDescription = (description: OutputData | undefined) => {
  return description ? JSON.stringify(description) : "";
};

export const TitleForm = ({ task, isLoading }: TitleFormProps) => {
  const { updateTask, fetchUpdateTask } = useActions();
  const [data, setData] = useState<OutputData | undefined>(undefined);
  const [taskDescription, setTaskDescription] = useState<OutputData | undefined>(undefined);
  const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null);

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

  // Fill form with task data
  useEffect(() => {
    if (task) {
      setTaskDescription(task.description ? parseJsonDesc(task.description) : undefined);
      form.setValues({ title: task.title, description: validateDescription(taskDescription) });
    }
  }, [task]);

  /*   const enableSaveButton =
    form.values.title !== "" &&
    (form.values.title !== task?.title ||
      form.values.description !== validateDescription(taskDescription))
      ? false
      : true; */

  // Save editor data on Form when change
  useEffect(() => {
    setTimeout(() => {
      editorInstance
        ?.save()
        .then(outputData => {
          form.setFieldValue("description", JSON.stringify(outputData));
        })
        .catch(error => console.log(error));
    }, 100);
  }, [editorInstance, data]);

  // Render editor data
  useEffect(() => {
    if (taskDescription) {
      editorInstance?.render(taskDescription);
    } else {
      editorInstance?.clear();
    }
  }, [editorInstance, taskDescription]);

  return isLoading ? (
    <Stack>
      <Skeleton height={50} />
      <Skeleton height={66} />
    </Stack>
  ) : (
    <form onSubmit={form.onSubmit(onUpdateTask)}>
      <Stack mb={"xl"}>
        <Textarea
          autosize
          size="lg"
          minRows={1}
          placeholder="Task Title"
          styles={theme => ({
            input: {
              fontSize: 22,
            },
          })}
          {...form.getInputProps("title")}
        />
        <EditorInput
          setData={setData}
          setEditorInstance={setEditorInstance}
          editorId="editorjs-task"
          data={taskDescription}
        />

        <Group position="right">
          <Button
            compact
            type="submit"
            /* disabled={enableSaveButton} */
            loading={updateTask.fetching}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
