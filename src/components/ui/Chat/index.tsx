import {
  ActionIcon,
  CloseButton,
  Group,
  Paper,
  Stack,
  rem,
  Text,
  useMantineTheme,
  useMantineColorScheme,
  Aside,
  ScrollArea,
  Loader,
  Textarea,
  Alert,
} from "@mantine/core";

import PlexoUserImage from "components/resources/PlexoUserImage";
import { usePlexoContext } from "context/PlexoContext";
import { GetMessagesDocument, SendMessageDocument } from "integration/graphql";
import { RefObject, useEffect, useRef, useState } from "react";
import { InfoCircle, Send } from "tabler-icons-react";
import { useQuery, useSubscription } from "urql";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "./utils";
import MessagesSkeleton from "./Skeleton";
import { getHotkeyHandler } from "@mantine/hooks";
import ChatProjectSelector from "./ProjectSelector";
import { Member } from "lib/types";

import ActionTaskButton from "./ActionTaskButton";

export type TaskChat = {
  id: string;
  title: string;
  lead: Member | null;
  created: boolean;
};

export type MessageProps = {
  id: string;
  type: string;
  role: string;
  message: string;
  createdAt: string;
};

type ChatProps = {
  chatOpened: boolean;
};

const Message = ({ message }: { message: MessageProps }) => {
  const theme = useMantineTheme();
  const assistantDarkBg =
    theme.colorScheme === "dark" ? theme.colors.brand[9] : theme.colors.green[1];
  const userLightBg = theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3];

  return (
    <Stack spacing={"xs"}>
      <Paper
        key={message.id}
        w={250}
        p="sm"
        sx={{
          backgroundColor: message.role == "assistant" ? assistantDarkBg : userLightBg,
          alignSelf: `${message.role == "assistant" ? "flex-start" : "flex-end"}`,
        }}
      >
        <Text fz={"sm"} color={theme.colorScheme === "dark" ? "white" : theme.colors.dark[6]}>
          {message.message}
        </Text>
      </Paper>
      <Text fz={"xs"} c={"dimmed"} align={message.role == "assistant" ? "left" : "right"}>
        {message.createdAt}
      </Text>
    </Stack>
  );
};

const TaskList = ({
  message,
  viewport,
}: {
  message: MessageProps;
  viewport: RefObject<HTMLDivElement>;
}) => {
  const theme = useMantineTheme();

  const [tasks, setTasks] = useState<TaskChat[]>([]);

  let tasksResponse = [];

  useEffect(() => {
    const msg = message.message;
    // Validar si existe mas de un input en la respuesta
    if (msg.includes("}{")) {
      // Separar JSON objects
      const jsonStrings = msg.split("}{");

      // Formatear JSON en un array
      const jsonArrayString = "[" + jsonStrings.join("},{") + "]";

      // Convertir JSON en objeto
      tasksResponse = JSON.parse(jsonArrayString);
    } else {
      //  Convertir JSON en objeto
      tasksResponse = [JSON.parse(msg)];
    }

    tasksResponse.map((obj: any) => {
      // Mapear las tareas
      setTasks([
        ...tasks,
        ...obj.input.map((item: any) => {
          return {
            id: uuidv4(),
            title: item.title,
            lead: null,
            created: false,
          };
        }),
      ]);
    });
  }, [message]);

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
                    {/* <Tooltip
                  label={task.lead?.name ? task.lead?.name : "No assignee"}
                  position="bottom"
                >
                  <ManualLeadTaskSelector task={task} tasks={tasks} setTasks={setTasks} />
                </Tooltip> */}

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

type MessageListProps = {
  isLoadingMessages: boolean;
  isTyping: boolean;
  messagesData: MessageProps[] | null;
  viewport: RefObject<HTMLDivElement>;
};

const MessageList = ({ isLoadingMessages, isTyping, messagesData, viewport }: MessageListProps) => {
  const theme = useMantineTheme();
  const assistantDarkBg =
    theme.colorScheme === "dark" ? theme.colors.brand[9] : theme.colors.green[1];

  return isLoadingMessages ? (
    <MessagesSkeleton />
  ) : (
    <Stack>
      {messagesData ? (
        messagesData.length ? (
          messagesData.map(item => {
            /* return <Message key={item.id} message={item} />; */
            return item.type === "text" ? (
              <Message key={item.id} message={item} />
            ) : (
              <TaskList key={item.id} message={item} viewport={viewport} />
            );
          })
        ) : (
          <Group py={"100%"}>
            <Alert color="gray" maw={250} m={"auto"} icon={<InfoCircle size="1rem" />}>
              <Text>No hay mensajes.</Text>
            </Alert>
          </Group>
        )
      ) : null}

      {isTyping && (
        <Paper
          px="xs"
          sx={{
            backgroundColor: assistantDarkBg,
            alignSelf: "flex-start",
          }}
        >
          <Loader size={"xs"} color="white" variant="dots" />
        </Paper>
      )}
    </Stack>
  );
};

const scrollToBottom = (viewport: RefObject<HTMLDivElement>) => {
  viewport.current!.scrollTo({ top: viewport.current!.scrollHeight /* behavior: "smooth" */ });
};

const Chat = ({ chatOpened }: ChatProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { setChatOpened } = usePlexoContext();

  const [inputMessage, setInputMessage] = useState("");
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [messagesData, setMessagesData] = useState<MessageProps[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const viewport = useRef<HTMLDivElement>(null);

  const [{ data: chat }, handlerSubscription] = useSubscription({
    pause: true,
    query: SendMessageDocument,
    variables: {
      chatId: chatId,
      message: message,
    },
  });

  const [{ data: messages, fetching: isLoadingMessages }, handlerGetMessages] = useQuery({
    pause: true,
    query: GetMessagesDocument,
    variables: {
      chatId: chatId,
    },
  });

  useEffect(() => {
    if (messages) {
      const data = messages.messages
        ?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(item => {
          const contentObject = JSON.parse(item.content);
          const { content, role, tool_call_id, tool_calls } = contentObject;

          const date = new Date(item.createdAt);
          const formatDate = formateDate(date);

          return {
            id: item.id as string,
            type: tool_call_id || tool_calls ? "tasks" : "text",
            role: role as string,
            message: content as string,
            createdAt: formatDate,
          };
        })
        .filter(item => item.type === "text"); // Mostrar solo los mensajes tipo texto
      setMessagesData(data);
    }
  }, [messages]);

  useEffect(() => {
    if (chat) {
      // Mensaje tipo tasks (tool calls)
      if (chat.chat.toolCalls) {
        if (chat.chat.messageId) {
          setMessagesData(prevMessagesData => [
            ...(prevMessagesData ?? []),
            {
              id: chat.chat.messageId,
              type: "tasks",
              role: "assistant",
              message: chat.chat.message,
              createdAt: formateDate(new Date()),
            },
          ]);

          // Reset values and stop typing
          setMessage("");
          setIsTyping(false);
        }
      } else {
        // Stop typing
        setIsTyping(false);

        // Mensajes tipo texto
        const generatedMessage = messagesData?.find(message => message.id === "generatedMessage");

        if (chat.chat.messageId) {
          // Actualizar el ID del mensaje cuando se termine de generar

          if (generatedMessage) {
            generatedMessage.id = chat.chat.messageId;
          }
          setMessage("");
        } else {
          // Actualizar el mensaje mientras se va generando
          if (generatedMessage) {
            // Reemplazar mensaje si el item ya existe en array de mensajes

            generatedMessage.message = chat.chat.message;
          } else {
            // Crear item en array de mensajes en caso aun no exista

            setMessagesData(prevMessagesData => [
              ...(prevMessagesData ?? []),
              {
                id: "generatedMessage",
                type: "text",
                role: "assistant",
                message: chat.chat.message,
                createdAt: formateDate(new Date()),
              },
            ]);
          }
        }
      }
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom(viewport);
  }, [messagesData, isTyping, chat]);

  // Set chatId after created it
  useEffect(() => {
    if (chatId) {
      handlerGetMessages();
    }
  }, [chatId]);

  const handleSendMessage = () => {
    //Add message to the list
    setMessagesData(prevMessagesData => [
      ...(prevMessagesData ?? []),
      {
        id: uuidv4(),
        type: "text",
        role: "user",
        message: message,
        createdAt: formateDate(new Date()),
      },
    ]);

    //Execute subscription
    if (message.trim() !== "") {
      handlerSubscription();
      setIsTyping(true);
      setInputMessage("");
    }
  };

  return (
    <Aside width={{ sm: 350 }} hiddenBreakpoint="md" hidden={!chatOpened}>
      <Aside.Section
        bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1]}
      >
        <Group
          p={"sm"}
          sx={{
            borderBottom: `${rem(1)} solid ${
              theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
          }}
        >
          <Stack w={"100%"}>
            <Group position="apart">
              <Group>
                <PlexoUserImage
                  scale={0.12}
                  backgroundColor={colorScheme === "light" ? theme.colors.gray[1] : undefined}
                />
                <Text size={"sm"}>Plexo</Text>
              </Group>

              <CloseButton
                aria-label="Close chat"
                onClick={() => setChatOpened(false)}
                color={theme.primaryColor}
              />
            </Group>

            <ChatProjectSelector
              setChatId={setChatId}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
            />
          </Stack>
        </Group>
      </Aside.Section>

      <Aside.Section grow p={"sm"} component={ScrollArea} viewportRef={viewport}>
        {selectedProject ? (
          <MessageList
            isLoadingMessages={isLoadingMessages}
            isTyping={isTyping}
            messagesData={messagesData}
            viewport={viewport}
          />
        ) : (
          <Group py={"100%"}>
            <Alert color="gray" maw={250} m={"auto"} icon={<InfoCircle size="1rem" />}>
              <Text>Choose a project to view chat messages.</Text>
            </Alert>
          </Group>
        )}
      </Aside.Section>

      <Aside.Section
        p={"sm"}
        bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1]}
      >
        <Group spacing={"xs"}>
          <Textarea
            autosize
            minRows={1}
            maxRows={4}
            variant="default"
            radius="sm"
            size="sm"
            placeholder="Ask Plexo..."
            value={inputMessage}
            disabled={selectedProject ? false : true}
            onChange={event => {
              setInputMessage(event.currentTarget.value);
              setMessage(event.currentTarget.value);
            }}
            onKeyDown={
              message.trim() === "" ? undefined : getHotkeyHandler([["Enter", handleSendMessage]])
            }
            sx={{ flex: 1 }}
          />
          <ActionIcon
            size="lg"
            variant="subtle"
            color={theme.primaryColor}
            onClick={() => handleSendMessage()}
            disabled={message.trim() !== "" || selectedProject ? false : true}
          >
            <Send size={18} strokeWidth={1.5} />
          </ActionIcon>
        </Group>
      </Aside.Section>
    </Aside>
  );
};

export default Chat;
