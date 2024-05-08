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
import { formateDate, scrollToBottom } from "./utils";
import MessagesSkeleton from "./Skeleton";
import { getHotkeyHandler } from "@mantine/hooks";
import ChatProjectSelector from "./ProjectSelector";

import TextMessage, { TextMessageProps } from "./Messages/TextMessage";
import TaskMessage from "./Messages/TaskMessage";

type ChatProps = {
  chatOpened: boolean;
};

type MessageListProps = {
  isLoadingMessages: boolean;
  isTyping: boolean;
  messagesData: TextMessageProps[] | null;
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
            return item.type === "text" ? (
              <TextMessage key={item.id} message={item} />
            ) : (
              <TaskMessage key={item.id} message={item} viewport={viewport} />
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

const Chat = ({ chatOpened }: ChatProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { setChatOpened } = usePlexoContext();

  const [inputMessage, setInputMessage] = useState("");
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [messagesData, setMessagesData] = useState<TextMessageProps[] | null>(null);
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
    <Aside
      width={{ md: 350, lg: 350 }}
      styles={{
        root: {
          [theme.fn.smallerThan("md")]: {
            width: 350,
          },
          [theme.fn.smallerThan("xs")]: {
            width: "100%",
          },
        },
      }}
    >
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
