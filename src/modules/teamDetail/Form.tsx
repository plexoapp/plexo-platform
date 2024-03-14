import { Button, Group, Skeleton, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import { TeamById } from "lib/types";
import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";

type TitleFormProps = {
  team: TeamById | undefined;
  isLoading: boolean;
};

export const TitleForm = ({ team, isLoading }: TitleFormProps) => {
  const { updateTeam, fetchUpdateTeam } = useActions();

  const form = useForm({
    initialValues: {
      name: "",
    },

    validate: {
      name: value => (value.length < 2 ? "Team name must have at least 2 letters" : null),
    },
  });

  const onUpdateTeam = async (values: typeof form.values) => {
    const res = await fetchUpdateTeam({
      id: team?.id,
      input: {
        name: values.name,
      },
    });

    if (res.data) {
      SuccessNotification("Team updated", res.data.updateTeam.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  useEffect(() => {
    if (team) {
      form.setValues({ name: team.name });
    }
  }, [team]);

  const enableSaveButton =
    form.values.name === "" ? true : form.values.name !== team?.name ? false : true;

  return isLoading ? (
    <Stack>
      <Skeleton height={50} />
      <Skeleton height={66} />
    </Stack>
  ) : (
    <form onSubmit={form.onSubmit(onUpdateTeam)}>
      <Stack mb={"xl"}>
        <TextInput
          size="lg"
          variant="filled"
          placeholder="Team Name"
          styles={theme => ({
            input: {
              fontSize: 22,
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
            },
          })}
          {...form.getInputProps("name")}
        />

        <Group position="right">
          <Button compact type="submit" disabled={enableSaveButton} loading={updateTeam.fetching}>
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
