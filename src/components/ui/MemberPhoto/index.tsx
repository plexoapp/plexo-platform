import { Avatar } from "@mantine/core";

type Payload = {
  name: string;
  photoUrl?: string | undefined | null;
};

export const MemberPhoto = (member: Payload | undefined | null) => {
  return member?.photoUrl && member.photoUrl !== "" ? (
    <Avatar src={member.photoUrl} size="xs" radius="xl" />
  ) : member?.name ? (
    <Avatar
      color="brand"
      size={18}
      radius="xl"
      styles={{
        placeholder: {
          fontSize: 10,
        },
      }}
    >
      {member?.name[0]}
    </Avatar>
  ) : (
    <Avatar size="sm" radius="xl" />
  );
};
