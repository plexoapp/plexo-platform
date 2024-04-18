import { RefObject, useEffect, useState } from "react";
import { TextMessageProps } from "./TextMessage";
import { Group, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import { scrollToBottom } from "../utils";
import ActionTaskButton from "./ActionTaskButton";
import { ManualLeadTaskSelector } from "components/ui/Task/lead";
import { Member } from "lib/types";

export type TaskChat = {
  id: string;
  title: string;
  lead: Member | null;
  leadId: string | null;
  created: boolean;
};

const TaskMessage = ({
  message,
  viewport,
}: {
  message: TextMessageProps;
  viewport: RefObject<HTMLDivElement>;
}) => {
  const theme = useMantineTheme();

  const [tasks, setTasks] = useState<TaskChat[]>([]);
  const [tasksResponse, setTasksResponse] = useState<any[]>([]);

  useEffect(() => {
    const msg = message.message;
    // Validar si existe mas de un input en la respuesta
    if (msg.includes("}{")) {
      // Separar JSON objects
      const jsonStrings = msg.split("}{");

      // Formatear JSON en un array
      const jsonArrayString = "[" + jsonStrings.join("},{") + "]";

      // Convertir JSON en objeto (array)
      setTasksResponse(JSON.parse(jsonArrayString));
    } else {
      //  Convertir JSON en objeto (array)
      setTasksResponse([JSON.parse(msg)]);
    }
  }, [message]);

  useEffect(() => {
    if (tasksResponse.length) {
      tasksResponse.forEach((obj: any) => {
        const tempTasks: TaskChat[] = [];

        obj.input.forEach((item: any) => {
          const newTask: TaskChat = {
            id: uuidv4(),
            title: item.title ? item.title : "",
            lead: null,
            leadId: item.assignee_id && item.assignee_id.length >= 36 ? item.assignee_id : null,
            created: false,
          };

          tempTasks.push(newTask);
        });

        setTasks(prevTasks => [...prevTasks, ...tempTasks]);
      });
    }
  }, [tasksResponse]);

  useEffect(() => {
    scrollToBottom(viewport);
  }, [tasks]);

  return (
    <Stack spacing={"xs"}>
      <Paper
        key={message.id}
        w={"100%"}
        p={8}
        sx={{
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.brand[9] : theme.colors.green[1],
          alignSelf: "flex-start",
        }}
      >
        <Stack spacing={"xs"}>
          <Text fz={"sm"} color={theme.colorScheme === "dark" ? "white" : theme.colors.dark[6]}>
            Create your tasks:
          </Text>
          <Stack spacing={0}>
            {tasks?.map((task, index) => {
              return (
                <Paper key={index} px={6} py={4} mt={1}>
                  <Group spacing={0}>
                    <ManualLeadTaskSelector
                      task={task}
                      tasks={tasks}
                      setTasks={setTasks}
                      suggestedLeadId={task.leadId}
                    />

                    <Text size={"sm"} sx={{ flex: 1 }}>
                      {task.title}
                    </Text>

                    <ActionTaskButton task={task} tasks={tasks} setTasks={setTasks} />
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Stack>
      </Paper>
      <Text fz={"xs"} c={"dimmed"} align={"left"}>
        {message.createdAt}
      </Text>
    </Stack>
  );
};

export default TaskMessage;
