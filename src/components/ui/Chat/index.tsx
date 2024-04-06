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
} from "@mantine/core";
import PlexoUserImage from "components/resources/PlexoUserImage";
import { usePlexoContext } from "context/PlexoContext";
import { useEffect, useState } from "react";
import { Send } from "tabler-icons-react";

type SelectDataProps = {
  value: string;
  label: string;
};

const messages = [
  {
    id: "1",
    rol: "user",
    message: "Hola",
  },
  {
    id: "2",
    rol: "assistant",
    message: "Hola",
  },
];

type ChatProps = {
  chatOpened: boolean;
};

const Chat = ({ chatOpened }: ChatProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { projectsData, isLoadingProjects, setChatOpened } = usePlexoContext();
  const [projects, setProjects] = useState<SelectDataProps[]>([]);

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

  const userDarkBg = theme.colorScheme === "dark" ? theme.colors.brand[9] : theme.colors.green[0];
  const assistantLightBg =
    theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1];

  return (
    <Aside width={{ sm: 300 }} hiddenBreakpoint="md" hidden={!chatOpened}>
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
              <Stack spacing={4}>
                <Text size={"sm"}>Plexo</Text>
                {/*  <Group spacing={"xs"}>
                <ColorSwatch color={theme.colors.green[4]} size={6} />
                <Text size={"xs"}>Active</Text>
              </Group> */}
              </Stack>
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

      <Aside.Section grow component={ScrollArea} p={"sm"}>
        <Stack>
          {messages.map(item => {
            return (
              <Paper
                key={item.id}
                w={250}
                p="sm"
                sx={{
                  backgroundColor: item.rol == "user" ? userDarkBg : assistantLightBg,
                  alignSelf: `${item.rol == "user" ? "flex-start" : "flex-end"}`,
                }}
              >
                <Text
                  fz={"xs"}
                  color={theme.colorScheme === "dark" ? "white" : theme.colors.dark[6]}
                >
                  {item.message}
                </Text>
              </Paper>
            );
          })}
        </Stack>
      </Aside.Section>

      <Aside.Section p={"sm"}>
        <TextInput
          autoFocus
          variant="default"
          radius={"xl"}
          size="sm"
          placeholder="Write something..."
          rightSectionWidth={42}
          rightSection={
            <ActionIcon size={32} variant="transparent" color={theme.primaryColor}>
              <Send size={18} strokeWidth={1.5} />
            </ActionIcon>
          }
          /* styles={{
            input: {
              backgroundColor: theme.colors.green[0],
            },
          }} */
        />
      </Aside.Section>
    </Aside>
  );
};

export default Chat;
