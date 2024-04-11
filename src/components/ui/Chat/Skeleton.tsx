import { Skeleton, Stack, Text } from "@mantine/core";

const MessagesSkeleton = () => {
  return (
    <Stack h={"100%"} justify="flex-end">
      <Text fz={"xs"} align="center" c={"dimmed"}>
        Loading messages
      </Text>
      <Skeleton w={250} height={45} radius="sm" sx={{ alignSelf: "flex-start" }} />
      <Skeleton w={250} height={45} radius="sm" sx={{ alignSelf: "flex-end" }} />
      <Skeleton w={250} height={45} radius="sm" sx={{ alignSelf: "flex-start" }} />
      <Skeleton w={250} height={45} radius="sm" sx={{ alignSelf: "flex-end" }} />
    </Stack>
  );
};

export default MessagesSkeleton;
