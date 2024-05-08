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
import { useEffect, useRef, useState } from "react";
import { InfoCircle, Send } from "tabler-icons-react";
import { useQuery, useSubscription } from "urql";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "./utils";
import MessagesSkeleton from "./Skeleton";
import { getHotkeyHandler } from "@mantine/hooks";
import ChatProjectSelector from "./ProjectSelector";

export type MessageProps = {
  id: string;
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
        <Text
          fz={"sm"}
          color={theme.colorScheme === "dark" ? "white" : theme.colors.dark[6]}
          sx={{
            wordWrap: "break-word",
          }}
        >
          {message.message}
        </Text>
      </Paper>
      <Text fz={"xs"} c={"dimmed"} align={message.role == "assistant" ? "left" : "right"}>
        {message.createdAt}
      </Text>
    </Stack>
  );
};

type MessageListProps = {
  isLoadingMessages: boolean;
  isTyping: boolean;
  messagesData: MessageProps[] | null;
};

const MessageList = ({ isLoadingMessages, isTyping, messagesData }: MessageListProps) => {
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
            return <Message key={item.id} message={item} />;
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
          const { content, role } = contentObject;

          const date = new Date(item.createdAt);
          const formatDate = formateDate(date);

          return {
            id: item.id as string,
            role: role as string,
            message: content as string,
            createdAt: formatDate,
          };
        });
      setMessagesData(data);
    }
  }, [messages]);

  useEffect(() => {
    if (chat) {
      if (chat.chat.messageId) {
        setMessagesData(prevMessagesData => [
          ...(prevMessagesData ?? []),
          {
            id: chat.chat.messageId,
            role: "assistant",
            message: chat.chat.message,
            createdAt: formateDate(new Date()),
          },
        ]);

        setIsTyping(false);
        setMessage("");
      } else {
        setIsTyping(true);
      }
    }
  }, [chat]);

  useEffect(() => {
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: "smooth" });
  }, [messagesData, isTyping]);

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
        role: "user",
        message: message,
        createdAt: formateDate(new Date()),
      },
    ]);

    //Execute subscription
    if (message.trim() !== "") {
      handlerSubscription();
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
