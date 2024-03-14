import { Group, Skeleton, Stack, Text, ThemeIcon, Timeline } from "@mantine/core";
import { Pencil, Trash, UserCircle } from "tabler-icons-react";
import { useQuery } from "urql";

import { TaskChanges, TaskById } from "lib/types";
import { TaskChangesDocument, ChangeResourceType } from "integration/graphql";

const formatDateDifference = (date: string) => {
  const currentDate = new Date();
  const providedDate = new Date(date);

  const timeDifference = currentDate.getTime() - providedDate.getTime();

  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  if (secondsDifference < 60) {
    return `${secondsDifference} seconds ago`;
  } else if (minutesDifference < 60) {
    return `${minutesDifference} ${minutesDifference == 1 ? "minute" : "minutes"} ago`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference} ${hoursDifference == 1 ? "hour" : "hours"} ago`;
  } else {
    return `${daysDifference} ${daysDifference == 1 ? "day" : "days"} ago`;
  }
};

const ActivityIcon = ({ activity }: { activity: TaskChanges }) => {
  const color = activity.operation == "DELETE" ? "red" : "gray";
  return (
    <ThemeIcon size={16} color={color} variant="light" radius="xl">
      {activity.operation == "INSERT" ? (
        <UserCircle />
      ) : activity.operation == "UPDATE" ? (
        <Pencil />
      ) : activity.operation == "DELETE" ? (
        <Trash />
      ) : (
        <></>
      )}
    </ThemeIcon>
  );
};

const ActivityDescription = ({ activity }: { activity: TaskChanges | undefined }) => {
  const description =
    activity?.operation == "INSERT"
      ? ` created the task - ${formatDateDifference(activity.createdAt)}`
      : activity?.operation == "UPDATE"
      ? ` updated the task - ${formatDateDifference(activity.createdAt)}`
      : activity?.operation == "DELETE"
      ? ` deleted the task - ${formatDateDifference(activity.createdAt)}`
      : `${activity?.operation}`;

  return (
    <Text color="dimmed" size="xs">
      <Text span fw={700}>
        {activity?.owner.name}
      </Text>
      {description}
    </Text>
  );
};

const ActivitySkeleton = ({ rows }: { rows: number }) => {
  return (
    <Stack m={"sm"}>
      {Array.from({ length: rows }).map((_, index) => {
        return (
          <Group key={index}>
            <Skeleton height={18} circle />
            <Skeleton height={8} maw={200} radius="xl" />
          </Group>
        );
      })}
    </Stack>
  );
};

export const ActivitiesTask = ({
  task,
  isLoading,
}: {
  task: TaskById | undefined;
  isLoading: boolean;
}) => {
  const [{ data: activityData, fetching: isLoadingActivity }] = useQuery({
    pause: task ? false : true,
    query: TaskChangesDocument,
    variables: {
      input: {
        filter: {
          resourceId: task?.id,
          resourceType: ChangeResourceType.Tasks,
        },
      },
    },
  });

  const activityItems = activityData
    ? activityData.changes.map(a => {
        return (
          <Timeline.Item key={a.id} bullet={<ActivityIcon activity={a} />}>
            <ActivityDescription activity={a} />
          </Timeline.Item>
        );
      })
    : null;

  return (
    <Stack spacing={0}>
      <Text size={"sm"} color={"dimmed"}>
        Activity
      </Text>
      {isLoadingActivity || isLoading ? (
        <ActivitySkeleton rows={4} />
      ) : (
        <Timeline
          m={"sm"}
          bulletSize={20}
          lineWidth={2}
          styles={{
            itemBullet: {
              backgroundColor: "transparent",
            },
          }}
        >
          {activityItems}
        </Timeline>
      )}
    </Stack>
  );
};
