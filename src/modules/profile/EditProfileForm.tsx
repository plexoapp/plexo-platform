import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { UpdateProfileDocument } from "integration/graphql";
import { User } from "lib/types";
import { useMutation } from "urql";
import { useEffect } from "react";

import { ErrorNotification, SuccessNotification } from "lib/notifications";

type EditProfileFormProps = {
  userData: User | undefined;
  opened: boolean;
  close: () => void;
};

const validatePhotoUrl = (photoUrl: string | null | undefined) => {
  return photoUrl ? photoUrl : "";
};

export const EditProfileForm = ({ userData, opened, close }: EditProfileFormProps) => {
  const [updateProfileResult, updateProfile] = useMutation(UpdateProfileDocument);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      photoUrl: "",
    },
    validate: {
      name: val => (val.length <= 2 ? "Your name should include at least 2 characters" : null),
      email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const onUdateProfile = async (values: typeof form.values) => {
    const res = await updateProfile({
      input: {
        ...(values.name !== userData?.name && { name: values.name }),
        ...(values.email !== userData?.email && { email: values.email }),
        ...(values.photoUrl !== userData?.photoUrl && { photoUrl: values.photoUrl }),
      },
    });

    if (res.data) {
      SuccessNotification("Saved!", "Your profile information has been updated.");
      close();
    }

    if (res.error) {
      ErrorNotification();
    }
  };

  useEffect(() => {
    if (userData) {
      form.setValues({
        name: userData.name,
        email: userData.email,
        photoUrl: userData.photoUrl ? userData.photoUrl : "",
      });
    }
  }, [userData]);

  const enableButton =
    form.values.name !== userData?.name ||
    form.values.email !== userData?.email ||
    form.values.photoUrl !== validatePhotoUrl(userData?.photoUrl)
      ? false
      : true;

  return (
    <Modal opened={opened} onClose={close} title="Edit Profile">
      <form onSubmit={form.onSubmit(onUdateProfile)}>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Your name"
            withAsterisk
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="you@plexo.app"
            withAsterisk
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Photo url"
            placeholder="https://www.myphoto.com"
            {...form.getInputProps("photoUrl")}
          />

          <Group position="right" mt="md">
            <Button type="submit" loading={updateProfileResult.fetching} disabled={enableButton}>
              Save changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
