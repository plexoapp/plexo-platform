import { Button, Group, Skeleton, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import EditorJS, { OutputData } from "@editorjs/editorjs";

import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { ProjectById } from "lib/types";
import { useEffect, useState } from "react";
import { EditorInput } from "components/ui/Editor/EditorInput";
import { parseJsonDesc } from "lib/utils";

type TitleFormProps = {
  project: ProjectById | undefined;
  isLoading: boolean;
};

const validateDescription = (description: OutputData | undefined) => {
  return description ? JSON.stringify(description) : "";
};

export const TitleForm = ({ project, isLoading }: TitleFormProps) => {
  const { updateProject, fetchUpdateProject } = useActions();
  const [data, setData] = useState<OutputData | undefined>(undefined);
  const [projectDescription, setProjectDescription] = useState<OutputData | undefined>(undefined);
  const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: value => (value.length < 2 ? "Project name must have at least 2 letters" : null),
    },
  });

  const onUpdateProject = async (values: typeof form.values) => {
    const res = await fetchUpdateProject({
      id: project?.id,
      input: {
        name: values.name,
        description: values.description,
      },
    });

    if (res.data) {
      SuccessNotification("Project updated", res.data.updateProject.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  useEffect(() => {
    if (project) {
      setProjectDescription(project.description ? parseJsonDesc(project.description) : undefined);
      form.setValues({ name: project.name, description: validateDescription(projectDescription) });
    }
  }, [project]);

  /*   const enableSaveButton =
    form.values.name !== "" &&
    (form.values.name !== project?.name ||
      form.values.description !== validateDescription(projectDescription))
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
    if (projectDescription) {
      editorInstance?.render(projectDescription);
    } else {
      editorInstance?.clear();
    }
  }, [editorInstance, projectDescription]);

  return isLoading ? (
    <Stack>
      <Skeleton height={50} />
      <Skeleton height={66} />
    </Stack>
  ) : (
    <form onSubmit={form.onSubmit(onUpdateProject)}>
      <Stack mb={"xl"}>
        <Textarea
          autosize
          size="lg"
          minRows={1}
          placeholder="Project Name"
          styles={theme => ({
            input: {
              fontSize: 22,
            },
          })}
          {...form.getInputProps("name")}
        />
        <EditorInput
          setData={setData}
          setEditorInstance={setEditorInstance}
          editorId="editorjs-project"
          data={projectDescription}
        />

        <Group position="right">
          <Button
            compact
            type="submit"
            /* disabled={enableSaveButton} */
            loading={updateProject.fetching}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
