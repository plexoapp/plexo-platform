import {
  ActionIcon,
  CloseButton,
  Group,
  Paper,
  Stack,
  TextInput,
  rem,
  Text,
  useMantineTheme,
  useMantineColorScheme,
  Aside,
  ScrollArea,
  Loader,
} from "@mantine/core";

import PlexoUserImage from "components/resources/PlexoUserImage";
import { usePlexoContext } from "context/PlexoContext";
import { MessagesDocument, SendMessageDocument } from "integration/graphql";
import { useEffect, useRef, useState } from "react";
import { Send } from "tabler-icons-react";
import { useQuery, useSubscription } from "urql";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "./utils";
import MessagesSkeleton from "./Skeleton";
import { getHotkeyHandler } from "@mantine/hooks";

type SelectDataProps = {
  value: string;
  label: string;
};

type MessageProps = {
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

const Chat = ({ chatOpened }: ChatProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { projectsData, isLoadingProjects, setChatOpened } = usePlexoContext();

  const [projects, setProjects] = useState<SelectDataProps[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [message, setMessage] = useState("");
  const [messagesData, setMessagesData] = useState<MessageProps[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const viewport = useRef<HTMLDivElement>(null);

  const assistantDarkBg =
    theme.colorScheme === "dark" ? theme.colors.brand[9] : theme.colors.green[1];

  const [{ data: chat }, handlerSubscription] = useSubscription({
    pause: true,
    query: SendMessageDocument,
    variables: {
      message: message,
    },
  });

  const [{ data: messages, fetching: isLoadingMessages }] = useQuery({
    query: MessagesDocument,
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
    const getPorts = () => {
      const parseData: SelectDataProps[] = projectsData
        ? projectsData.map(item => {
            return { value: item.id, label: item.name };
          })
        : [];
      setProjects(parseData);
    };
    getPorts();
  }, [projectsData]);

  useEffect(() => {
    if (chat) {
      if (chat.chat.messageId) {
        // Add message to the list
        setMessagesData([
          ...messagesData,
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
  }, [messagesData]);

  const handleSendMessage = () => {
    //Add message to the list
    setMessagesData([
      ...messagesData,
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
    <Aside width={{ sm: 350 }} hiddenBreakpoint="md" hidden={!chatOpened}>
      <Aside.Section>
        <Group
          p={"sm"}
          h={73}
          sx={{
            borderBottom: `${rem(1)} solid ${
              theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
          }}
        >
          <Group position="apart" w={"100%"}>
            <Group /* sx={{ flex: 1 }} */>
              <PlexoUserImage
                scale={0.12}
                backgroundColor={colorScheme === "light" ? theme.colors.gray[1] : undefined}
              />
              <Text size={"sm"}>Plexo</Text>
            </Group>
            {/* <Select
            variant="filled"
            size="xs"
            disabled={isLoadingProjects}
            placeholder="Select a project"
            data={projects}
          /> */}
            <CloseButton
              aria-label="Close chat"
              onClick={() => setChatOpened(false)}
              color={theme.primaryColor}
            />
          </Group>
        </Group>
      </Aside.Section>

      <Aside.Section grow p={"sm"} component={ScrollArea} viewportRef={viewport}>
        {isLoadingMessages ? (
          <MessagesSkeleton />
        ) : (
          <Stack>
            {messagesData.map(item => {
              return <Message key={item.id} message={item} />;
            })}
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
        )}
      </Aside.Section>

      <Aside.Section p={"sm"}>
        <TextInput
          autoFocus
          variant="default"
          radius={"xl"}
          size="sm"
          placeholder="Ask Plexo..."
          rightSectionWidth={42}
          value={inputMessage}
          onChange={event => {
            setInputMessage(event.currentTarget.value);
            setMessage(event.currentTarget.value);
          }}
          onKeyDown={
            message.trim() === "" ? undefined : getHotkeyHandler([["Enter", handleSendMessage]])
          }
          rightSection={
            <ActionIcon
              size={32}
              variant="transparent"
              color={theme.primaryColor}
              onClick={() => handleSendMessage()}
              disabled={message.trim() === "" ? true : false}
            >
              <Send size={18} strokeWidth={1.5} />
            </ActionIcon>
          }
        />
      </Aside.Section>
    </Aside>
  );
};

export default Chat;
